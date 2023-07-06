import firebaseConfig from '@/config/firebase';
import {
  getFirestore,
  doc,
  addDoc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  runTransaction,
  query,
  where,
  deleteDoc,
  updateDoc,
  onSnapshot,
  Unsubscribe,
  orderBy,
  limit,
  Timestamp,
  DocumentData,
} from 'firebase/firestore';

import { startOfDay, endOfDay } from 'date-fns';

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import {
  Carts,
  Medicine,
  ProcurementData,
  SalesData,
  User,
  resultRequest,
} from '@/types';
import { LEAD_TIME_AVG, LEAD_TIME_MAX } from '@/constant/numbers';

const db = getFirestore(firebaseConfig);

const obatCollection = 'obat';
const penjualanCollection = 'penjualan';
const pengadaanCollection = 'pengadaan';

const storage = getStorage();

export const addUser = async (collection: string, id: string, data: {}) => {
  let result = null,
    error = null;

  try {
    result = await setDoc(doc(db, collection, id), data, { merge: true });
  } catch (err) {
    error = err;
  }

  return { result, error };
};

export const getUserLogged = async (collection: string, id: string) => {
  let documentRef = doc(db, collection, id);
  let userLogged: User | null = null,
    error = null;

  try {
    let result = await getDoc(documentRef);
    if (result.exists()) {
      const currentUser = result.data() as User;

      userLogged = {
        email: currentUser.email,
        role: currentUser.role,
        uid: currentUser.uid,
        username: currentUser.username,
      };
    } else {
      userLogged = null;
    }
  } catch (err) {
    error = err;
  }

  return { userLogged, error };
};

export const getMedicines = async (collectionName: string) => {
  let result: Medicine[] = [],
    error: Error | any = null;

  const avgSales = await getAverageDailySalesByMedicine(6); //masih hardcode
  const highestSales = await getHighestDailySalesByMedicine(6); //masih hardcode

  let documentRef = query(collection(db, collectionName));
  try {
    let res = await getDocs(documentRef);

    for (const doc of res.docs) {
      const medicineData = doc.data();
      const MAX = highestSales[medicineData.id] * LEAD_TIME_MAX;
      const AVG = avgSales[medicineData.id] * LEAD_TIME_AVG;
      const safetyStockCalculation = MAX - AVG;

      const isExistInProcurement = await checkMedicineExistsInProcurement(
        medicineData.id
      );

      const medicine: Medicine = {
        id: medicineData.id,
        medicine_name: medicineData.medicine_name,
        price: medicineData.price,
        stock: medicineData.stock,
        image: medicineData.image,
        safetyStock: Math.ceil(safetyStockCalculation || 0),
        isExistInProcurement,
      };

      result.push(medicine);
    }
  } catch (err) {
    error = err;
  }

  return {
    result,
    error,
  };
};

export const subscribeToCollectionChanges = (
  collectionName: string,
  callback: (medicines: any[]) => void
): Unsubscribe => {
  const documentRef = collection(db, collectionName);
  const unsubscribe = onSnapshot(documentRef, snapshot => {
    const updatedData: any[] = [];
    snapshot.forEach(doc => {
      updatedData.push(doc.data());
    });
    callback(updatedData);
  });

  return unsubscribe;
};

export const unsubscribeFromCollectionChanges = (unsubscribe: Unsubscribe) => {
  unsubscribe();
};

export const addMedicine = async (
  namaObat: string,
  harga: string,
  stock: number,
  imgFile: File | null
) => {
  let result: String | any = null,
    error: Error | any = null;

  const obatCollectionRef = collection(db, obatCollection);
  const obatQuery = query(
    obatCollectionRef,
    where('medicine_name', '==', namaObat)
  );

  try {
    await runTransaction(db, async () => {
      const obatSnapshot = await getDocs(obatQuery);

      if (!obatSnapshot.empty) {
        return (error = new Error('Data obat sudah ada.'));
      }

      let imageUrl = null;

      const obatData = {
        id: '',
        medicine_name: namaObat,
        price: harga,
        stock,
        image: imageUrl,
      };
      const newMedicineRef = await addDoc(obatCollectionRef, obatData);

      const newObatID = newMedicineRef.id;

      if (imgFile) {
        const imageRef = ref(storage, `medicine/${newObatID}/${imgFile.name}`);
        await uploadBytes(imageRef, imgFile);

        imageUrl = await getDownloadURL(imageRef);
      }

      await setDoc(
        newMedicineRef,
        { ...obatData, id: newObatID, image: imageUrl },
        { merge: true }
      );

      result = 'Data obat berhasil ditambahkan.';
    });
  } catch (err) {
    error = err;
    return error;
  }

  return { result, error };
};

export const deleteMedicine = async (idObat: string) => {
  let result: string | any = null,
    error: Error | any = null;
  try {
    const obatDocRef = doc(collection(db, obatCollection), idObat);
    await deleteDoc(obatDocRef);
    result = 'Data obat berhasil dihapus';
  } catch (err) {
    error = err;
    return error;
  }

  return { result, error };
};

export const updateMedicine = async (
  id: string,
  updatedData: Medicine,
  imgFile: File | null
) => {
  let result: String | any = null,
    error: Error | any = null;

  try {
    const obatDocRef = doc(db, obatCollection, id);

    if (imgFile) {
      const imageRef = ref(storage, `medicine/${id}/${imgFile.name}`);
      await uploadBytes(imageRef, imgFile);

      const imageUrl = await getDownloadURL(imageRef);
      updatedData.image = imageUrl;
    }

    const convertedData: { [key: string]: any } = {};
    Object.entries(updatedData).forEach(([key, value]) => {
      convertedData[key] = value;
    });

    await updateDoc(obatDocRef, convertedData);
    result = `Data obat berhasil diperbarui`;
  } catch (err) {
    error = err;
    return error;
  }

  return { result, error };
};

const generateOrderId = async () => {
  const penjualanRef = collection(db, penjualanCollection);
  try {
    const result = await runTransaction(db, async () => {
      const checkQuery = query(
        penjualanRef,
        orderBy('idOrder', 'desc'),
        limit(1)
      );
      const docSnap = await getDocs(checkQuery);

      let newOrderId = 'PNJ0001';
      if (!docSnap.empty) {
        const penjualanDocs = docSnap.docs;
        const lastOrderDoc = penjualanDocs[penjualanDocs.length - 1];
        const lastOrderId = lastOrderDoc.data().idOrder;

        const lastOrderNumber = parseInt(lastOrderId.substring(3));
        const newOrderNumber = lastOrderNumber + 1;
        newOrderId = 'PNJ' + newOrderNumber.toString().padStart(4, '0');
      }
      return newOrderId;
    });

    return result;
  } catch (error) {
    console.error('Error generating orderId:', error);
    throw error;
  }
};

const reduceStock = async (obatId: string, quantity: number) => {
  const obatRef = doc(collection(db, 'obat'), obatId);

  try {
    await runTransaction(db, async transaction => {
      const obatDoc = await getDoc(obatRef);
      if (obatDoc.exists()) {
        const currentStock = obatDoc.data().stock;

        if (currentStock < quantity) {
          throw new Error('Stock obat tidak mencukupi');
        }

        const newStock = currentStock - quantity;
        transaction.update(obatRef, { stock: newStock });
      }
    });
  } catch (error) {
    console.error('Error reducing stock:', error);
    throw error;
  }
};

export const createPenjualan = async (carts: Carts[]) => {
  let result: resultRequest | null = null;
  let error: any = null;

  const penjualanCollectionRef = collection(db, penjualanCollection);

  try {
    const totalPenjualan = carts.reduce((total, item) => {
      const itemPrice = parseFloat(item.MedicineInCart.price);
      const itemQuantity = item.totalMedicine;
      return total + itemPrice * itemQuantity;
    }, 0);

    const totalItems = carts.reduce(
      (total, item) => total + item.totalMedicine,
      0
    );

    const orderId = await generateOrderId();

    const dataPenjualan = {
      tanggal: new Date(),
      idOrder: orderId,
      obat: carts,
      totalPenjualan: totalPenjualan,
      totalItems: totalItems,
      uid: '',
    };

    const newPenjualanRef = await addDoc(penjualanCollectionRef, dataPenjualan);

    await setDoc(newPenjualanRef, { uid: newPenjualanRef.id }, { merge: true });

    const obatIds = carts.map(item => item.MedicineInCart.id);
    const quantities = carts.map(item => item.totalMedicine);
    for (let i = 0; i < obatIds.length; i++) {
      await reduceStock(obatIds[i], quantities[i]);
    }

    result = {
      code: 200,
      status: 'Success',
      message: 'Pembelian berhasil disimpan',
    };
  } catch (err) {
    error = err;
    return error;
  }

  return { result, error };
};

const getHighestDailySalesByMedicine = async (month: number) => {
  const startDate = new Date(2023, month, 1); // Mulai dari tanggal awal bulan
  const endDate = new Date(2023, month + 1, 0); // Sampai tanggal terakhir bulan

  const penjualanRef = collection(db, 'penjualan');
  const q = query(
    penjualanRef,
    where('tanggal', '>=', startDate),
    where('tanggal', '<=', endDate)
  );
  const querySnapshot = await getDocs(q);

  const totalSalesByMedicine: { [medicine_name: string]: number } = {};

  querySnapshot.forEach(doc => {
    const penjualan = doc.data();
    const penjualanDate = penjualan.tanggal.toDate().toLocaleDateString(); // Mengambil tanggal penjualan saja (tanpa waktu)

    penjualan.obat.forEach((item: Carts) => {
      const { MedicineInCart, totalMedicine } = item;
      const medicine_name = MedicineInCart.id;

      // Jika belum ada total penjualan untuk tanggal tersebut, set nilainya ke totalPenjualan
      if (!totalSalesByMedicine[medicine_name + '_' + penjualanDate]) {
        totalSalesByMedicine[medicine_name + '_' + penjualanDate] =
          totalMedicine;
      } else {
        // Jika sudah ada total penjualan untuk tanggal tersebut, tambahkan totalPenjualan ke nilai yang sudah ada
        totalSalesByMedicine[medicine_name + '_' + penjualanDate] +=
          totalMedicine;
      }
    });
  });

  // Mengembalikan nilai terbesar dari tiap obat
  const highestSalesByMedicine: { [medicineId: string]: number } = {};
  Object.keys(totalSalesByMedicine).forEach(key => {
    const [medicineId, penjualanDate] = key.split('_');
    const totalPenjualan = totalSalesByMedicine[key];

    if (
      !highestSalesByMedicine[medicineId] ||
      totalPenjualan > highestSalesByMedicine[medicineId]
    ) {
      highestSalesByMedicine[medicineId] = totalPenjualan;
    }
  });

  return highestSalesByMedicine;
  // return totalSalesByMedicine;
};

const getAverageDailySalesByMedicine = async (month: number) => {
  const startDate = new Date(2023, month, 1); // Mulai dari tanggal awal bulan
  const endDate = new Date(2023, month + 1, 0); // Sampai tanggal terakhir bulan

  const penjualanRef = collection(db, 'penjualan');
  const q = query(
    penjualanRef,
    where('tanggal', '>=', startDate),
    where('tanggal', '<=', endDate)
  );
  const querySnapshot = await getDocs(q);

  const totalSalesByMedicine: { [medicine_name: string]: number } = {};
  const salesCountByMedicine: { [medicineId: string]: number } = {};

  querySnapshot.forEach(doc => {
    const penjualan = doc.data();
    const penjualanDate = penjualan.tanggal.toDate().toLocaleDateString(); // Mengambil tanggal penjualan saja (tanpa waktu)

    penjualan.obat.forEach((item: Carts) => {
      const { MedicineInCart, totalMedicine } = item;
      const medicine_name = MedicineInCart.id;
      const key = medicine_name + '_' + penjualanDate;

      if (!salesCountByMedicine[key]) {
        salesCountByMedicine[key] = 1; // Set jumlah transaksi obat menjadi 0
      } else {
        salesCountByMedicine[key] += 1; // Tambahkan jumlah transaksi obat
      }

      if (!totalSalesByMedicine[key]) {
        totalSalesByMedicine[key] = totalMedicine; // Set total penjualan obat
      } else {
        totalSalesByMedicine[key] += totalMedicine; // Tambahkan total penjualan obat
      }
    });
  });

  const avgSalesByMedicine: { [medicine_name: string]: number } = {};

  const medicines = Array.from(
    new Set(Object.keys(totalSalesByMedicine).map(key => key.split('_')[0]))
  );

  medicines.forEach(medicineId => {
    const totalPenjualanHarian = Object.keys(totalSalesByMedicine)
      .filter(key => key.startsWith(medicineId))
      .reduce((sum, key) => sum + totalSalesByMedicine[key], 0);

    const totalHariTransaksi = Object.keys(totalSalesByMedicine)
      .filter(key => key.startsWith(medicineId))
      .map(key => key.split('_')[1])
      .filter((value, index, self) => self.indexOf(value) === index).length;

    const avgPenjualanHarian = totalPenjualanHarian / totalHariTransaksi; // Hitung rata-rata penjualan per hari

    avgSalesByMedicine[medicineId] = avgPenjualanHarian; // Simpan rata-rata penjualan obat
  });

  return avgSalesByMedicine;
};

export const getDataPenjualan = async (startDate: Date, endDate: Date) => {
  let result: resultRequest | null = null;
  let error: any = null;

  const start = startOfDay(startDate);
  const end = endOfDay(endDate);

  const penjualanCollectionRef = collection(db, penjualanCollection);

  try {
    const getQuery = query(
      penjualanCollectionRef,
      where('tanggal', '>=', start),
      where('tanggal', '<=', end),
      orderBy('tanggal', 'asc')
    );

    const querySnapshot = await getDocs(getQuery);
    const dataPenjualan: SalesData[] = [];

    querySnapshot.forEach(doc => {
      const penjualan = doc.data();
      dataPenjualan.push({
        idOrder: penjualan.idOrder,
        tanggal: penjualan.tanggal,
        obat: penjualan.obat,
        totalPenjualan: penjualan.totalPenjualan,
        totalItems: penjualan.totalItems,
        uid: penjualan.uid,
      });
    });
    result = {
      code: 200,
      status: 'Success',
      message: 'Data penjualan berhasil ditemukan',
      data: dataPenjualan,
    };
  } catch (err) {
    error = err;
    return error;
  }
  return { result, error };
};

export const createPengadaan = async (medicineData: Medicine, Qty: number) => {
  let result: resultRequest | null = null;
  let error: any = null;

  const pengadaanCollectionRef = collection(db, pengadaanCollection);

  try {
    const payload: ProcurementData = {
      uid: '',
      procurementDate: Timestamp.now(),
      medicine: {
        id: medicineData.id,
        medicine_name: medicineData.medicine_name,
        price: medicineData.price,
        stock: medicineData.stock,
        image: medicineData.image,
      },
      Qty,
      oldStock: medicineData.stock.toString(),
      status: 'Dipesan',
    };
    const newProcurementRef = await addDoc(pengadaanCollectionRef, payload);
    await setDoc(
      newProcurementRef,
      { uid: newProcurementRef.id },
      { merge: true }
    );

    result = {
      code: 200,
      message: 'Data berhasil diproses',
      status: 'Sukses',
    };
  } catch (err) {
    error = err;
    console.error(error);
    return error;
  }

  return { result, error };
};

export const checkMedicineExistsInProcurement = async (medicineId: string) => {
  const procurementRef = collection(db, 'pengadaan');
  const q = query(
    procurementRef,
    where('medicine.id', '==', medicineId),
    where('status', '==', 'Dipesan')
  );
  const querySnapshot = await getDocs(q);
  const exists = !querySnapshot.empty;

  return exists;
};

export const getProcurementByMedicineId = async (
  medicineId: string
): Promise<ProcurementData | null> => {
  try {
    const querySnapshot = await getDocs(collection(db, pengadaanCollection));

    for (const doc of querySnapshot.docs) {
      const procurementData = doc.data() as DocumentData & ProcurementData;
      if (
        procurementData.medicine.id === medicineId &&
        procurementData.status === 'Dipesan'
      ) {
        return procurementData;
      }
    }
  } catch (error) {
    console.error(error);
  }

  return null; // Return null if no procurement data found
};

export const getProcurementById = async (procurementId: string) => {
  let procurementData: ProcurementData | null = null;

  try {
    const procurementRef = doc(db, pengadaanCollection, procurementId);
    const procurementSnapshot = await getDoc(procurementRef);

    if (procurementSnapshot.exists()) {
      procurementData = procurementSnapshot.data() as ProcurementData;
    }
  } catch (err) {
    console.error('Error fetching procurement data:', err);
  }

  return procurementData;
};

export const updateProcurementStatus = async (procurementId: string) => {
  let result: resultRequest | null = null;
  let error: any = null;
  try {
    const procurementRef = doc(db, pengadaanCollection, procurementId);

    await updateDoc(procurementRef, {
      procurementDate: Timestamp.now(),
      status: 'Konfirmasi',
    });

    const procurementData = await getProcurementById(procurementId);

    if (procurementData) {
      const { medicine, Qty } = procurementData;

      await updateMedicineStock(medicine.id, Qty);
    }

    result = {
      code: 200,
      message: 'Data berhasil dikonfirmasi',
      status: 'Sukses',
    };
  } catch (err) {
    error = err;
    return error;
  }

  return { result, error };
};

export const getConfirmedProcurements = async (
  startDate: Date,
  endDate: Date
) => {
  let result: resultRequest | null = null;

  const start = startOfDay(startDate);
  const end = endOfDay(endDate);

  const procurementCollectionRef = collection(db, pengadaanCollection);

  const q = query(
    procurementCollectionRef,
    where('procurementDate', '>=', start),
    where('procurementDate', '<=', end),
    orderBy('procurementDate', 'desc')
  );

  try {
    const querySnapshot = await getDocs(q);

    const confirmedProcurements: ProcurementData[] = [];

    querySnapshot.forEach(doc => {
      const procurementData = doc.data() as ProcurementData;
      if (procurementData.status !== 'Dipesan') {
        confirmedProcurements.push(procurementData);
      }
    });

    result = {
      code: 200,
      message: 'Berhasil memuat data',
      status: 'Sukses',
      data: confirmedProcurements,
    };
  } catch (err) {
    result = {
      code: 500,
      message: err,
      status: 'Error',
      data: [],
    };
  }

  return result;
};

export const updateMedicineStock = async (
  medicineId: string,
  qty: number,
  editFromTransactionProcurement: boolean = false,
  oldStock: number = 0
) => {
  const medicineRef = doc(db, obatCollection, medicineId);

  try {
    const medicineSnapshot = await getDoc(medicineRef);
    const currentStock = medicineSnapshot.data()?.stock || 0;

    let newStock;
    if (!editFromTransactionProcurement) {
      newStock = parseInt(currentStock) + qty;
    } else {
      newStock = oldStock + qty;
    }

    await updateDoc(medicineRef, { stock: newStock });
  } catch (error) {
    console.error('Error updating medicine stock:', error);
    throw error;
  }
};

export const updateProcurementData = async (
  procurementId: string,
  medicineId: string,
  medicineName: string,
  qty: number,
  oldStock: number
) => {
  let result: resultRequest | null = null;
  try {
    const procurementRef = doc(db, pengadaanCollection, procurementId);

    await updateDoc(procurementRef, {
      Qty: qty,
      'medicine.medicine_name': medicineName,
    });

    await updateMedicineStock(medicineId, qty, true, oldStock);

    result = {
      code: 200,
      message: 'Data pengadaan berhasil diperbarui',
      status: 'Sukses',
    };
  } catch (error) {
    result = {
      code: 500,
      message: error,
      status: 'Error',
    };
  }
  return result;
};
