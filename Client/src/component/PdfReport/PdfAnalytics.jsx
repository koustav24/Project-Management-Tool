import { Document, Page, PDFViewer, Text, View } from "@react-pdf/renderer";
import { pdfStyles } from "./pdfStyles";
import { useGetSpecficProjectDetailsQuery } from "../../redux/api/api";
import { LayoutLoader } from "../Layouts/Loader";
import axios from "axios";
import { useEffect, useState } from "react";
import { formatDate } from "../utility/features";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const PdfAnalytics = () => {
  const navigate = useNavigate();
  const params=useParams();
  const projectId=params.projectId;
  const { data: projectSpecificData, isLoading } = useGetSpecficProjectDetailsQuery(
    projectId
  );
  const user = useSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [taskData, setTaskData] = useState([]);
  console.log("ps",projectSpecificData);
  console.log("user",user);

  // First useEffect - for access control
  useEffect(() => {
    if (!isLoading) { // Ensure Redux has finished loading
      if (user.user.role !== "Admin") {
        toast.error("Access Denied: You don't have permission to view this document");
        navigate('/projects', { replace: true });
      } else {
        setIsChecking(false);
      }
    }
  }, [user, isLoading, navigate]);

  // Second useEffect - for fetching tasks
  useEffect(() => {
    // Only fetch tasks if we're not checking permissions and not loading
    if (!isChecking && !isLoading) {
      const fetchTasks = async () => {
        setLoading(true);
        try {
          const { data } = await axios.post(
            `http://localhost:3000/task/projectTask`,
            { projectId },
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          // Formatting the data
          const formattedData = [
            ["Task Name", "Assigned To", "Due Date", "Status"], // Table headers
            ...data.tasks.map((task) => [
              task.title,
              task.assignedTo.length > 0
                ? task.assignedTo.map((user) => user.name).join(", ")
                : "Unassigned",
              formatDate(task.deadline) || "N/A",
              task.status,
            ]),
          ];
          console.log('task',data)
          setTaskData(formattedData);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };
      fetchTasks();
    }
  }, [isChecking, isLoading]);

  // Render loading state if needed
  if (isChecking || isLoading || loading) {
    return <LayoutLoader />;
  }

  return (
    <PDFViewer width="100%" height="600px">
      <Document>
        <Page size="A4" style={pdfStyles.page}>
          {/* Header Section */}
          <View style={pdfStyles.header}>
            <Text style={pdfStyles.title}>Project Data Report</Text>
            <Text style={pdfStyles.subTitle}>
              {projectSpecificData.pDetails.name || "Project Name"}
            </Text>
          </View>

          {/* Project Members Section */}
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>Project Members</Text>

            <View style={pdfStyles.memberList}>
              {projectSpecificData?.pDetails?.teamMembers?.length > 0 ? (
                projectSpecificData.pDetails.teamMembers.map((member, index) => (
                  <Text key={index} style={pdfStyles.memberItem}>
                    {member.name}
                  </Text>
                ))
              ) : (
                <Text style={pdfStyles.memberItem}>No members assigned</Text>
              )}
            </View>
          </View>

          {/* Task Data Table */}
          <View style={pdfStyles.table}>
            {/* Render Table Header */}
            <Text style={pdfStyles.sectionTitle}>Task Details</Text>
            {taskData.length > 0 && (
              <View style={[pdfStyles.tableRow, pdfStyles.headerRow]}>
                {taskData[0].map((header, i) => (
                  <Text key={i} style={pdfStyles.tableColHeader}>
                    {header}
                  </Text>
                ))}
              </View>
            )}

            {/* Render Table Rows */}
            {taskData.slice(1).map((row, rowIndex) => (
              <View key={rowIndex} style={pdfStyles.tableRow}>
                {row.map((cell, cellIndex) => (
                  <Text key={cellIndex} style={pdfStyles.tableCol}>
                    {cell}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default PdfAnalytics;