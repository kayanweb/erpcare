using System;
using System.Security.Cryptography;
using System.Text;
using System.Management;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace HIS_License_Manager
{
    // ==========================================
    // Hardware Fingerprint Generator
    // ==========================================
    public static class HardwareFingerprint
    {
        public static string GetFingerprint()
        {
            string cpuInfo = GetWMIProperty("Win32_Processor", "ProcessorId");
            string biosInfo = GetWMIProperty("Win32_BIOS", "SerialNumber");
            string mbInfo = GetWMIProperty("Win32_BaseBoard", "SerialNumber");
            string diskInfo = GetWMIProperty("Win32_DiskDrive", "SerialNumber");

            string rawId = $"{cpuInfo}-{biosInfo}-{mbInfo}-{diskInfo}";
            return ComputeSha256(rawId);
        }

        private static string GetWMIProperty(string wmiClass, string property)
        {
            try
            {
                string result = "";
                ManagementObjectSearcher searcher = new ManagementObjectSearcher($"SELECT {property} FROM {wmiClass}");
                foreach (ManagementObject mo in searcher.Get())
                {
                    result += mo[property]?.ToString();
                }
                return result.Trim();
            }
            catch
            {
                return "UNKNOWN";
            }
        }

        private static string ComputeSha256(string input)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(input));
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("X2"));
                }
                return builder.ToString();
            }
        }
    }

    // ==========================================
    // License Service API Client
    // ==========================================
    public class LicenseService
    {
        private static readonly string API_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";
        private static readonly HttpClient client = new HttpClient();

        public async Task<bool> ValidateLicenseAsync(string serial)
        {
            string hwid = HardwareFingerprint.GetFingerprint();
            string requestUrl = $"{API_URL}?action=ValidateLicense&serial={serial}&hwid={hwid}";

            try
            {
                HttpResponseMessage response = await client.GetAsync(requestUrl);
                string responseBody = await response.Content.ReadAsStringAsync();
                
                var result = JsonConvert.DeserializeObject<dynamic>(responseBody);
                if (result.success == true)
                {
                    string signedToken = result.token;
                    // Save signedToken to local encrypted file for offline use
                    SaveLocalLicense(signedToken);
                    return true;
                }
                else
                {
                    Console.WriteLine($"Validation Failed: {result.message}");
                    return false;
                }
            }
            catch (Exception ex)
            {
                // Fallback to Offline Mode
                return ValidateOfflineLicense();
            }
        }

        private void SaveLocalLicense(string token)
        {
            // Implementation to encrypt token with AES and save to AppData
        }

        private bool ValidateOfflineLicense()
        {
            // Implementation to read local AES token, verify HMAC, and check ExpirationDate
            return false;
        }
    }
}
