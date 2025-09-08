import { useState } from "react";
import { UserCreditsContext } from "../context/UserCreditsContext";
import DashboardLayout from "../layout/DashboardLayout";
import { useContext } from "react";
import { useAuth } from "@clerk/clerk-react";
import { AlertCircle } from "lucide-react";
import UploadBox from "../components/UploadBox";
import { apiEndpoints } from "../util/apiEndpoints";
import axios from "axios";
import { useEffect } from "react";

const Upload=()=>{

  const [files, setFiles] = useState([]);
      const [uploading, setUploading] = useState(false);
      const [message, setMessage] = useState("");
      const [messageType, setMessageType] = useState(""); //success or error
        const { getToken, isLoaded, userId } = useAuth();
      
        useEffect(() => {
          console.log("isLoaded:", isLoaded, "userId:", userId);
      
          const displayToken = async () => {
            if (!isLoaded) {
              console.log("⏳ Clerk not loaded yet");
              return;
            }
            if (!userId) {
              console.log("⚠️ No user signed in");
              return;
            }
            try {
              const token = await getToken();
              console.log("✅ JWT Token:", token);
            } catch (err) {
              console.error("❌ Failed to fetch token:", err);
            }
          };
      
          displayToken();
        }, [isLoaded, userId, getToken]);
      const {credits, setCredits} = useContext(UserCreditsContext);
      const MAX_FILES = 5;


      const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        if (files.length + selectedFiles.length > MAX_FILES) {
            setMessage(`You can only upload a maximum of ${MAX_FILES} files at once`);
            setMessageType("error");
            return;
        }

        //add the new files into the existing files
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
        setMessage("");
        setMessageType("");
    }

    const handleRemoveFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
        setMessageType("");
        setMessage("");
    }

    const isUploadDisabled = files.length === 0 || files.length > MAX_FILES || credits <= 0 || files.length > credits;

    const handleUpload = async () => {
            if (files.length === 0){
                setMessageType("error");
                setMessage("Please select atleast one file to upload.");
                return;
            }
    
            if (files.length > MAX_FILES) {
                setMessage(`You can only upload a maximum of ${MAX_FILES} files at once.`);
                setMessageType("error");
                return;
            }
    
            setUploading(true);
            setMessage("Uploading files...");
            setMessageType("info");
    
            const formData = new FormData();
            files.forEach((file) => formData.append("files", file));
    
            try {
                const token = await getToken();
                const response = await axios.post(apiEndpoints.UPLOAD_FILE, formData, {headers: {"Content-Type": "multipart/form-data", Authorization: `Bearer ${token}`}});
    
                if (response.data && response.data.remainingCredits !== undefined) {
                    setCredits(response.data.remainingCredits);
                }
    
                setMessage("Files uploaded successfully.");
                setMessageType("success");
                setFiles([]);
            }catch(error) {
                console.error('Error uploading files: ', error);
                setMessage(error.response?.data?.message || "Error uploading files. Please try again.");
                setMessageType("error");
            }finally {
                setUploading(false);
            }
        }

  return(
    <DashboardLayout activeMenu="Upload">
      <div className="p-6">
                {message && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${messageType === 'error' ? 'bg-red-50 text-red-700': messageType === 'success' ? 'bg-green-50 text-green-700': 'bg-blue-50 text-blue-700'}`}>
                        {messageType === 'error' && <AlertCircle size={20} />}
                        {message}
                    </div>
                )}

                <UploadBox
                    files={files}
                    onFileChange={handleFileChange}
                    onUpload={handleUpload}
                    uploading={uploading}
                    onRemoveFile={handleRemoveFile}
                    remainingCredits={credits}
                    isUploadDisabled={isUploadDisabled}
                />
            </div>
    </DashboardLayout>

  )
}
export default Upload;