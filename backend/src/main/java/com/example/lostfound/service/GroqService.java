package com.example.lostfound.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class GroqService {

    @Value("${groq.api.key}")
    private String apiKey;

    private final HttpClient httpClient=HttpClient.newHttpClient();
    private final ObjectMapper objectMapper=new ObjectMapper();

    public String generateCategory(String itemName) {

        try {

            String prompt="""
                    Categorize the following lost and found item.

                    Item name: %s

                    Choose exactly ONE category from:
                    Electronics
                    Accessories
                    Documents
                    Clothing
                    Bags
                    Books
                    Stationery
                    Keys
                    Other

                    Return ONLY the category name.
                    Do not provide any explanation.
                    """.formatted(itemName);

            String requestBody="""
                    {
                        "model":"openai/gpt-oss-20b",
                        "messages":[
                            {
                                "role":"user",
                                "content":%s
                            }
                        ],
                        "temperature":0
                    }
                    """.formatted(
                            objectMapper.writeValueAsString(prompt)
                    );

            HttpRequest request=HttpRequest.newBuilder()
                    .uri(
                        URI.create(
                            "https://api.groq.com/openai/v1/chat/completions"
                        )
                    )
                    .header(
                        "Authorization",
                        "Bearer "+apiKey
                    )
                    .header(
                        "Content-Type",
                        "application/json"
                    )
                    .POST(
                        HttpRequest.BodyPublishers.ofString(requestBody)
                    )
                    .build();

            HttpResponse<String> response=
                    httpClient.send(
                            request,
                            HttpResponse.BodyHandlers.ofString()
                    );

            if(response.statusCode()!=200) {
                System.out.println(
                    "Groq API Error: "+response.body()
                );
                return "Other";
            }

            JsonNode json=
                    objectMapper.readTree(response.body());

            String category=
                    json.get("choices")
                        .get(0)
                        .get("message")
                        .get("content")
                        .asText()
                        .trim();

            category=category.replace("\"","").trim();

            if(
                category.equals("Electronics") ||
                category.equals("Accessories") ||
                category.equals("Documents") ||
                category.equals("Clothing") ||
                category.equals("Bags") ||
                category.equals("Books") ||
                category.equals("Stationery") ||
                category.equals("Keys") ||
                category.equals("Other")
            ) {
                return category;
            }

            return "Other";

        } catch(Exception e) {
            System.out.println(
                "Groq Error: "+e.getMessage()
            );
            return "Other";
        }
    }
}