import { ProcurementData, SalesData } from '@/types';
import { formatCurrency } from '@/utils/helper';
import { Document, Page, Text, StyleSheet, View } from '@react-pdf/renderer';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  title: {
    paddingVertical: 20,
    fontSize: '24px',
    fontWeight: 600,
    textAlign: 'center',
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  tableRow: {
    paddingHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#fdfdfd',
  },
  tableCellHeader: {
    paddingVertical: 15,
    fontWeight: 'bold',
  },
  tableCell: {
    paddingVertical: 15,
    fontSize: '14px',
    fontWeight: 400,
    textAlign: 'center',
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
        <Page size='A4'>
          <Text style={styles.title}>
            Report Penjualan {format(startDate, 'dd MMMM yyyy')} -{' '}
            {format(endDate, 'dd MMMM yyyy')}
          </Text>
          <View style={styles.table}>
            {/* Table header */}
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Tanggal</Text>
              <Text style={styles.tableCellHeader}>Id Order</Text>
              <Text style={styles.tableCellHeader}>Total</Text>
            </View>
            {/* Table rows */}
            {data.length > 0 ? (
              data.map((item: SalesData) => (
                <View key={item.uid} style={styles.tableRow}>
                  <Text style={styles.tableCell}>
                    {format(item.tanggal.toDate(), 'dd MMMM yyyy')}
                  </Text>
                  <Text style={styles.tableCell}>{item.idOrder}</Text>
                  <Text style={styles.tableCell}>
                    {formatCurrency(item.totalPenjualan)}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.title}>Tidak ada Data</Text>
            )}
          </View>
        </Page>
      )}

      {type === 'PNGDN' && (
        <Page size='A4'>
          <Text style={styles.title}>
            Report Pengadaan {format(startDate, 'dd MMMM yyyy')} -{' '}
            {format(endDate, 'dd MMMM yyyy')}
          </Text>
          <View style={styles.table}>
            {/* Table header */}
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Tanggal</Text>
              <Text style={styles.tableCellHeader}>Nama Obat</Text>
              <Text style={styles.tableCellHeader}>Qty</Text>
              <Text style={styles.tableCellHeader}>Stock</Text>
            </View>
            {/* Table rows */}
            {data.length > 0 ? (
              data.map((item: ProcurementData) => (
                <View key={item.uid} style={styles.tableRow}>
                  <Text style={styles.tableCell}>
                    {format(item.procurementDate.toDate(), 'dd MMMM yyyy')}
                  </Text>
                  <Text style={styles.tableCell}>
                    {item.medicine.medicine_name}
                  </Text>
                  <Text style={styles.tableCell}>{item.Qty}</Text>
                  <Text style={styles.tableCell}>
                    {item.Qty + item.oldStock}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.title}>Tidak ada Data</Text>
            )}
          </View>
        </Page>
      )}
    </Document>
  );
};

export default PdfContent;
