import { useState, useEffect } from "react";
import "./Student.css";
export default function Student() {

const [colleges, setColleges] = useState([]);
const [studentId, setStudentId] = useState(0);
const [name, setName] = useState("");
const [college, setCollege] = useState(0);
const [physics, setPhysics] = useState(0);
const [chemistry, setChemistry] = useState(0);
const [math, setMath] = useState(0);
const[students,setStudents]=useState([]);
const [search, setSearch] = useState("");
useEffect(()=>{

/*-------- for Dropdown of college name------- */
fetch("https://localhost:44359/api/Student/GetCollegeName")
.then((response)=>{
    if(!response.ok){
         throw new Error("Failed to fetch colleges");
    }
      return response.json();
})
.then((result)=>{
setColleges(result.data);
})
.catch((error) => {
      console.error("Error fetching colleges:", error);
    });
/*-------- ----------------------------------------- */
getallstudentlist();
},[])

/*------------------get all student list--------------- */
const getallstudentlist= async ()=>{

   const StudentId=0;
try{
  const response= await fetch(
    `https://localhost:44359/api/Student/GetallStudentdata?StudentId=${StudentId}`,
    {
       method:"GET",
        headers:{
          "Content-Type":"application/json"
        }       
    }
  );
  const result= await response.json();
  console.log("student data= ",result.data)
  setStudents(result.data??[])
}
catch(error){
console.error("Error fetching students:", error);
}

}
/*-------- ------for search---------------------------- */
const filteredStudents = students.filter((item) =>
  item.studentName.toLowerCase().includes(search.toLowerCase())
);

/**--------------------------------------- */
/*------------------- for total ,percentage calculation------------------- */

const total =  Number(physics || 0) +  Number(chemistry || 0) +  Number(math || 0);
const percentage = ((total / 300) * 100).toFixed(2);
const grade =
  percentage >= 90 ? "A+" :
  percentage >= 80 ? "A" :
  percentage >= 70 ? "B+" :
  percentage >= 60 ? "B" :
  percentage >= 50 ? "C" :
  percentage >= 40 ? "D" :
  "F";
/*-------- ----------------------------------------- */
const handleSave= async (e)=>{
    e.preventDefault();
      console.log("Save button clicked");
    if(!name.trim()){
    alert("Please enter Student Name");
    return;
    }
     if (!college) {
    alert("Please select College");
    return;
  }

  if (physics === "" || Number(physics) <= 0) {
    alert("Please enter valid Physics marks");
    return;
  }

  if (chemistry === "" || Number(chemistry) <= 0) {
    alert("Please enter valid Chemistry marks");
    return;
  }

  if (math === "" || Number(math) <= 0) {
    alert("Please enter valid Math marks");
    return;
  }
    const selectedCollege = colleges.find(
    (item) => String(item.collegeId) === String(college)
  );

   const studentData = {
    StudentId: Number(studentId),
    StudentName: name.trim(),
    CollegeID:Number(selectedCollege.collegeId),
    CollegeName: selectedCollege?.collegeName ?? "",
    Physics: Number(physics),
    Chemistry: Number(chemistry),
    Math: Number(math),
    Total: total,
    Percentage: Number(percentage),
    Grade: grade,
  };
   
  try{
    const response=await fetch(
       "https://localhost:44359/api/Student/AddeditStudentresult",
       {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
         body: JSON.stringify(studentData),
       }
    );
const result= await response.json();
  if (!response.ok) {
      throw new Error(
        result.message || "Failed to save student"
      );
    }
    else{
      console.log(result.status)
      if(result.status==1)
      alert("Student saved successfully");
    else if(result.status==2)
      alert("Student updated successfully");
    getallstudentlist();
       Resetall();
    }
  }
  catch(error){
    console.error("Error saving student:", error);
    alert(error.message || "Unable to save student");
  }
}
/*------- for save validation--------- */
/**=----------------------FOR EDIT------------------------ */
const handleEdit= async (StID)=>{
  try{
const response=await fetch(
  `https://localhost:44359/api/Student/EditViewStudentdata?StudentId=${StID}`,
  {
       method:"GET",
        headers:{
          "Content-Type":"application/json"
        }       
    }
)
const result= await response.json();
  
   const student = result.data?.[0]
    console.log("for edit getStudent details:", student);


    setStudentId(student.studentId);
        setName(student.studentName ?? "");
    setCollege(String(student.collegeID ?? ""));
    setPhysics(String(student.physics ?? ""));
    setChemistry(String(student.chemistry ?? ""));
    setMath(String(student.math ?? ""));
  }
  catch(ex){
alert(error.message);
  }
}
/**-----------------Delete ------------------------ */
const handledelete=async(StID)=>{
try{
const respnse=fetch(
  `https://localhost:44359/api/Student/DeleteStudentresult?StudentId=${StID}`,
  {
       method:"GET",
        headers:{
          "Content-Type":"application/json"
        }       
    }
)
const result= await response.json();  
    if(result.status==1)
      alert("Student deleted successfully");
    getallstudentlist();
       Resetall();
}
catch(ex){

}
}
/**----------------------------------------------- */
/**=-----------------reset-------------- */
const Resetall=()=>{
  setName("");
    setCollege("");
    setPhysics("");
    setChemistry("");
    setMath("");
}

 return (
    <div className="main_dv">
      <form  onSubmit={handleSave}>

        <label htmlFor="college">College</label>
        <select id="college" name="college" value={college} onChange={(e) => setCollege(e.target.value)} >
          <option value="">Select College</option>
          
          {
            colleges.map((item)=>  (
                <option key={item.collegeId}  value={item.collegeId}>
                    {item.collegeName}
                </option>
            )
            )
          }
        </select>

        <label htmlFor="fname">Name</label>
        <input type="text" id="fname" name="firstname"   value={name} onChange={(e) => setName(e.target.value)} />

        <div className="half_dv_wrp clearfix">
          <div className="half_dv">
            <h2>Marks :</h2>
            <hr />

            <div className="half_Wrp_dv clearfix">
              <label>Physics</label>
              <input type="number" id="physics" value={physics} onChange={(e)=>setPhysics(e.target.value)}/>
            </div>

            <div className="half_Wrp_dv clearfix">
              <label>Chemistry</label>
              <input type="number" id="chemistry" value={chemistry} onChange={(e)=>setChemistry(e.target.value)} />
            </div>

            <div className="half_Wrp_dv clearfix">
              <label>Math</label>
              <input type="number" id="math" value={math} onChange={(e)=>setMath(e.target.value)} />
            </div>

            <div className="half_Wrp_dv clearfix">
              <label htmlFor="total">Total</label>
              <input type="number"  id="total"  value={total}  readOnly />
            </div>
          </div>

          <div className="half_dv" style={{ marginTop: "44px" }}>
            <div className="half_Wrp_dv clearfix">
              <label>Grade</label>
              <input  type="text"  id="grade"  name="grade"  value={grade}  readOnly/>
            </div>

            <div className="half_Wrp_dv clearfix">
              <label htmlFor="percentage">Percentage (%)</label>
              <input type="number" id="percentage"  value={percentage}  readOnly />
            </div>
          </div>
        </div>

        <div className="btn_group">
          <button type="submit" value="Save" />
          <input type="reset" value="Reset" onClick={Resetall}/>
        </div>

        <div className="search-container">
          <input type="text"    placeholder="Search by student name..."
           name="search"  value={search}  onChange={(e) => setSearch(e.target.value)}/>
          <button type="button">
            <i className="fa fa-search" />
          </button>
        </div>

        <table id="customers">
          <thead>
            <tr>
              <th>Name</th>
              <th>Total</th>
              <th>%</th>
              <th>Edit</th>
              <th>Delete</th>
              <th>Print</th>
            </tr>
          </thead>

          <tbody>
            {
              filteredStudents.length > 0 ?
              (
                filteredStudents.map((item)=>(
                  <tr key={item.studentId}>
                    <td>{item.studentName}</td>
                    <td>{item.total}</td>
                    <td>{item.percentage}</td>
                    <td><i className="fa fa-pen-to-square"  aria-hidden="true"
                         title="Edit" style={{ cursor: "pointer" }}  onClick={() => handleEdit(item.studentId)}/> </td>
                    <td><i className="fa fa-trash" aria-hidden="true" title="Delete" style={{ cursor: "pointer" }} 
                        onClick={() => handledelete(item.studentId)} /> </td>
                    <td><i className="fa fa-print" aria-hidden="true" title="Print" style={{ cursor: "pointer" }}/> </td>
                  </tr>
                ))
              )
              : (
          <tr>
            <td colSpan="6">No students found</td>
          </tr>
            )}
          </tbody>
        </table>

        <div className="btn_group">
          <input type="button" value="Load More" />
        </div>
      </form>
    </div>
  );
}