using Newtonsoft.Json.Linq;
using System.Data;
using System.Data.SqlClient;

namespace Packing.DatabaseConnection
{
    public class ConnectDB
    {
        private string connectionString = "";
        SqlConnection connection;
        public ConnectDB()
        {
           connection = new SqlConnection(connectionString);
            
        }


        public DataTable SelectData(string StoredProcedure, SqlCommand commands=null!)
        {

            connection.Open();
            DataTable dataTable = new DataTable();
            if (commands != null)
            {
               commands.Connection = connection;
                commands.CommandType = CommandType.StoredProcedure;
                    SqlDataReader reader = commands.ExecuteReader();
                    dataTable.Load(reader);
            }
            else
            {
                using (SqlCommand command = new SqlCommand(StoredProcedure, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    //// เพิ่มพารามิเตอร์ (ถ้ามี)
                    //command.Parameters.AddWithValue("@param1", value1);
                    //command.Parameters.AddWithValue("@param2", value2);

                    connection.Open();
                    SqlDataReader reader = command.ExecuteReader();
                    dataTable.Load(reader);

                }
            }
             
                return dataTable;
            
        }
    
        public bool SaveData()
        {
            string connectionString = "Data Source=YourServer;Initial Catalog=YourDatabase;Integrated Security=True";
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand("InsertData", connection))
                {
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    // เพิ่มพารามิเตอร์สำหรับ Stored Procedure
                    //command.Parameters.AddWithValue("@param1", value1);
                    //command.Parameters.AddWithValue("@param2", value2);

                    connection.Open();
                    command.ExecuteNonQuery();
                }
            }
            return true;
        }
    }
}
