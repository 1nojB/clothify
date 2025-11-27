package com.clothify.orderservice.client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class UserClient {

    @Autowired
    private RestTemplate restTemplate;

    private static final String USER_URL = "http://localhost:8081/api/users";

    /**
     * Get user details
     */
    public UserResponse getUser(Integer userId) {
        try {
            String url = USER_URL + "/" + userId;
            return restTemplate.getForObject(url, UserResponse.class);
        } catch (Exception e) {
            System.err.println("User not found: " + userId);
            return null;
        }
    }

    /**
     * Validate user exists
     */
    public boolean userExists(Integer userId) {
        UserResponse user = getUser(userId);
        return user != null;
    }

    /**
     * Get user name
     */
    public String getUserName(Integer userId) {
        UserResponse user = getUser(userId);
        return user != null ? user.getName() : "Unknown User";
    }

    // Response class
    public static class UserResponse {
        private Integer id;
        private String name;
        private String email;
        private String phone;
        private String address;

        // Getters and Setters
        public Integer getId() { return id; }
        public void setId(Integer id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }

        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
    }
}