using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Text.Json;
using System.Collections.Generic;

namespace WebClient
{
    class Program
    {
        static async Task Main(string[] args)
        {
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri("http://localhost:8080/api/");  // Change the port if needed
            
            try
            {
                // Fetch available times of the day
                var timesOfDay = await FetchDataFromAPI<List<string>>(client, "timesofday");
                Console.WriteLine("Available Times of Day:");
                foreach (var time in timesOfDay)
                {
                    Console.WriteLine($"- {time}");
                }

                // Fetch available languages
                var languages = await FetchDataFromAPI<List<string>>(client, "languages");
                Console.WriteLine("\nSupported Languages:");
                foreach (var language in languages)
                {
                    Console.WriteLine($"- {language}");
                }

                // Prompt user for selections
                Console.WriteLine("\nSelect a Time of Day:");
                string selectedTimeOfDay = Console.ReadLine();

                Console.WriteLine("Select a Language:");
                string selectedLanguage = Console.ReadLine();

                Console.WriteLine("Select a Tone (Formal or Casual):");
                string selectedTone = Console.ReadLine();

                // Create a request object
                var request = new GreetingRequest
                {
                    TimeOfDay = selectedTimeOfDay,
                    Language = selectedLanguage,
                    Tone = selectedTone
                };

                // Get the greeting from the API
                var greeting = await GetGreeting(client, request);
                if (greeting != null)
                {
                    Console.WriteLine($"\nGreeting: {greeting.GreetingMessage}");
                }
                else
                {
                    Console.WriteLine("\nGreeting not found for the specified time of day and language.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
        }

        private static async Task<T> FetchDataFromAPI<T>(HttpClient client, string endpoint)
        {
            var response = await client.GetAsync(endpoint);
            response.EnsureSuccessStatusCode();
            var jsonString = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<T>(jsonString);
        }

        private static async Task<GreetingResponse> GetGreeting(HttpClient client, GreetingRequest request)
        {
            var jsonRequest = JsonSerializer.Serialize(request);
            var content = new StringContent(jsonRequest, System.Text.Encoding.UTF8, "application/json");
            var response = await client.PostAsync("greet", content);  // Change the endpoint name if needed

            if (response.IsSuccessStatusCode)
            {
                var jsonString = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<GreetingResponse>(jsonString);
            }

            return null;
        }
    }

    // Request model for the greeting
    public class GreetingRequest
    {
        public string TimeOfDay { get; set; }
        public string Language { get; set; }
        public string Tone { get; set; } = "Formal";  // Default to Formal
    }

    // Response model for the greeting
    public class GreetingResponse
    {
        public string GreetingMessage { get; set; }
        public string Tone { get; set; } = "Formal";  // Default to Formal
    }
}
