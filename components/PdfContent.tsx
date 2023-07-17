import { ProcurementData, SalesData } from '@/types';
import { formatCurrency } from '@/utils/helper';
import { Document, Page, Text, StyleSheet, View } from '@react-pdf/renderer';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    marginTop: 32,
    fontSize: '32px',
    fontWeight: 800,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 5,
    fontSize: '15px',
    fontWeight: 800,
    textAlign: 'center',
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 30,
  },

  column: {
    width: '25%',
    textAlign: 'center',
  },
  thRow: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',

    fontWeight: 800,
    fontSize: '14px',
  },
  tbodyRow: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    borderBottom: '0.5px solid #000',
    paddingVertical: 10,

    fontSize: '10px',
    fontWeight: 400,
  },
  thDetailOrder: {
    width: '25%',
    textAlign: 'left',
  },
  detailOrder: {
    width: '25%',
    display: 'flex',
    flexDirection: 'column',
    fontSize: '10px',
    textAlign: 'left',
  },

  pageNumbers: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: '12px',
    fontWeight: 600,
  },
});

const PdfContent = ({
  data,
  type,
  startDate,
  endDate,
}: {
  data: any[];
  type: string;
  startDate: Date;
  endDate: Date;
}) => {
  return (
    <Document>
      {type === 'PNJ' && (
        <Page size='A4' style={styles.body}>
          <Text style={styles.title}>REKAP PENJUALAN</Text>
          <Text style={styles.subtitle}>
            {format(startDate, 'dd MMMM yyyy')} -{' '}
            {format(endDate, 'dd MMMM yyyy')}
          </Text>
          <View style={styles.table}>
            {/* Table header */}
            <View style={styles.thRow}>
              <Text style={styles.column}>Tanggal</Text>
              <Text style={styles.column}>Id Order</Text>
              <Text style={styles.thDetailOrder}>Detail Order</Text>
              <Text style={styles.column}>Total</Text>
            </View>
            {/* Table rows */}
            {data.length > 0 ? (
              data.map((item: SalesData) => (
                <View key={item.uid} style={styles.tbodyRow}>
                  <Text style={styles.column}>
                    {format(item.tanggal.toDate(), 'dd MMMM yyyy')}
                  </Text>
                  <Text style={styles.column}>{item.idOrder}</Text>
                  <View style={styles.detailOrder}>
                    {item.obat.length > 0
                      ? item.obat.map((obat, index) => (
                          <View key={index}>
                            <Text>
                              {`${obat.MedicineInCart.medicine_name} (${obat.totalMedicine}x)`}
                            </Text>
                          </View>
                        ))
                      : ''}
                  </View>
                  <Text style={styles.column}>
                    {formatCurrency(item.totalPenjualan)}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.title}>Tidak ada Data</Text>
            )}
          </View>
          <Text
            style={styles.pageNumbers}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
            fixed
          />
        </Page>
      )}

      {type === 'PNGDN' && (
        <Page size='A4' style={styles.body}>
          <Text style={styles.title}>REKAP PENGADAAN</Text>
          <Text style={styles.subtitle}>
            {format(startDate, 'dd MMMM yyyy')} -{' '}
            {format(endDate, 'dd MMMM yyyy')}
          </Text>
          <View style={styles.table}>
            {/* Table header */}
            <View style={styles.thRow}>
              <Text style={styles.column}>Tanggal</Text>
              <Text style={styles.column}>Nama Obat</Text>
              <Text style={styles.column}>Qty</Text>
              <Text style={styles.column}>Stock</Text>
            </View>
            {/* Table rows */}
            {data.length > 0 ? (
              data.map((item: ProcurementData) => (
                <View key={item.uid} style={styles.tbodyRow}>
                  <Text style={styles.column}>
                    {format(item.procurementDate.toDate(), 'dd MMMM yyyy')}
                  </Text>
                  <Text style={styles.column}>
                    {item.medicine.medicine_name}
                  </Text>
                  <Text style={styles.column}>{item.Qty}</Text>
                  <Text style={styles.column}>{item.Qty + item.oldStock}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.title}>Tidak ada Data</Text>
            )}
          </View>
          <Text
            style={styles.pageNumbers}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
            fixed
          />
        </Page>
      )}
    </Document>
  );
};

export default PdfContent;
