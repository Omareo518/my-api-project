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
            client.BaseAddress = new Uri("https://your-vercel-app-url.vercel.app/api/"); // Update with your live API URL
            
            try
            {
                // Fetch available times of day
                var timesOfDay = await FetchDataFromAPI<List<string>>(client, "timesofday");
                Console.WriteLine("Available Times of Day:");
                foreach (var time in timesOfDay)
                {
                    Console.WriteLine($"- {time}");
                }

                // Fetch supported languages
                var languages = await FetchDataFromAPI<List<string>>(client, "languages");
                Console.WriteLine("\nSupported Languages:");
                foreach (var language in languages)
                {
                    Console.WriteLine($"- {language}");
                }

                // Collect user input
                Console.WriteLine("\nSelect a Time of Day:");
                string selectedTimeOfDay = Console.ReadLine();

                Console.WriteLine("Select a Language:");
                string selectedLanguage = Console.ReadLine();

                Console.WriteLine("Select a Tone (Formal or Casual):");
                string selectedTone = Console.ReadLine();

                // Create the greeting request
                var request = new GreetingRequest
                {
                    TimeOfDay = selectedTimeOfDay,
                    Language = selectedLanguage,
                    Tone = selectedTone
                };

                // Fetch greeting
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
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"Request error: {ex.Message}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected error: {ex.Message}");
            }
        }

        private static async Task<T> FetchDataFromAPI<T>(HttpClient client, string endpoint)
        {
            try
            {
                var response = await client.GetAsync(endpoint);
                response.EnsureSuccessStatusCode();
                var jsonString = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<T>(jsonString);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching data from {endpoint}: {ex.Message}");
                throw;
            }
        }

        private static async Task<GreetingResponse> GetGreeting(HttpClient client, GreetingRequest request)
        {
            try
            {
                var jsonRequest = JsonSerializer.Serialize(request);
                var content = new StringContent(jsonRequest, System.Text.Encoding.UTF8, "application/json");
                var response = await client.PostAsync("greet", content);

                if (response.IsSuccessStatusCode)
                {
                    var jsonString = await response.Content.ReadAsStringAsync();
                    return JsonSerializer.Deserialize<GreetingResponse>(jsonString);
                }

                Console.WriteLine($"Failed to fetch greeting: {response.StatusCode}");
                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error posting data to 'greet': {ex.Message}");
                throw;
            }
        }
    }

    public class GreetingRequest
    {
        public string? TimeOfDay { get; set; }
        public string? Language { get; set; }
        public string Tone { get; set; } = "Formal";
    }

    public class GreetingResponse
    {
        public string? GreetingMessage { get; set; }
        public string Tone { get; set; } = "Formal";
    }
}
