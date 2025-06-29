import { StyleSheet } from "@react-pdf/renderer";

export const pdfStyles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    backgroundColor: "#F9F9F9",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  subTitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    borderBottom: "2px solid #333",
    paddingBottom: 5,
  },
  table: {
    display: "table",
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #ddd",
    padding: 6,
  },
  headerRow: {
    backgroundColor: "#f2f2f2",
    fontWeight: "bold",
  },
  tableColHeader: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
    paddingVertical: 6,
    backgroundColor: "#007bff",
    color: "#ffffff",
  },
  tableCol: {
    flex: 1,
    textAlign: "center",
    padding: 6,
    fontSize: 11,
  },
  memberList: {
    marginLeft: 10,
    marginTop: 5,
    padding: 8,
    backgroundColor: "#f8f8f8",
    borderRadius: 5,
  },
  memberItem: {
    fontSize: 12,
    marginBottom: 5,
    paddingVertical: 4,
    paddingLeft: 8,
    borderLeft: "3px solid #007bff",
    color: "#333",
  },
});
