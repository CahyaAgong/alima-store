import { useState } from 'react';

import { ProcurementData, SalesData } from '@/types';
import { formatCurrency } from '@/utils/helper';
import {
  Document,
  Page,
  Text,
  StyleSheet,
  View,
  Font,
} from '@react-pdf/renderer';
import { format } from 'date-fns';

Font.register({
  family: 'Noto-Sans-Thai-Looped',
  fonts: [
    {
      src: '/font/Noto_Sans_Thai_Looped/NotoSansThaiLooped-Light.ttf',
      fontStyle: 'normal',
      fontWeight: 'light',
    },
    {
      src: '/font/Noto_Sans_Thai_Looped/NotoSansThaiLooped-Regular.ttf',
      fontStyle: 'normal',
    },
    {
      src: '/font/Noto_Sans_Thai_Looped/NotoSansThaiLooped-Bold.ttf',
      fontStyle: 'normal',
      fontWeight: 'bold',
    },
  ],
});

const styles = StyleSheet.create({
  body: {
    paddingTop: 15,
    paddingBottom: 65,
    paddingHorizontal: 35,
    fontFamily: 'Noto-Sans-Thai-Looped',
  },
  title: {
    marginTop: 20,
    fontSize: '32px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 5,
    fontSize: '15px',
    fontWeight: 'normal',
    textAlign: 'center',
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginTop: 32,
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
    marginBottom: 5,

    fontWeight: 'bold',
    fontSize: '13px',
  },
  tbodyRow: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    borderBottom: '0.5px solid #000',
    paddingBottom: 10,
    paddingTop: 5,

    fontSize: '10px',
    fontWeight: 'normal',
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
  titleNoFound: {
    fontSize: '14px',
    fontWeight: 'normal',
    textAlign: 'center',
  },
  pageNumbers: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: '10px',
    fontWeight: 'light',
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
            <View style={styles.thRow} fixed>
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
              <Text style={styles.titleNoFound}>Tidak ada Data</Text>
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
            <View style={styles.thRow} fixed>
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
              <Text style={styles.titleNoFound}>Tidak ada Data</Text>
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
