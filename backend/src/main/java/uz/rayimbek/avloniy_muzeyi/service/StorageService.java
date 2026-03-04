package uz.rayimbek.avloniy_muzeyi.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class StorageService {

    private static final Logger log = LoggerFactory.getLogger(StorageService.class);

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.anon-key}")
    private String supabaseAnonKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String uploadFile(MultipartFile file, String folder) throws IOException {
        String fileName = folder + "/" + UUID.randomUUID() + "_" + file.getOriginalFilename();
        String uploadUrl = supabaseUrl + "/storage/v1/object/media/" + fileName;

        log.info("Uploading to: {}", uploadUrl);
        log.info("File size: {}", file.getSize());
        log.info("Content type: {}", file.getContentType());

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + supabaseAnonKey);
            headers.setContentType(MediaType.parseMediaType(file.getContentType()));

            HttpEntity<byte[]> entity = new HttpEntity<>(file.getBytes(), headers);
            ResponseEntity<String> response = restTemplate.exchange(uploadUrl, HttpMethod.POST, entity, String.class);
            
            log.info("Upload response: {}", response.getStatusCode());
            return supabaseUrl + "/storage/v1/object/public/media/" + fileName;
            
        } catch (HttpClientErrorException e) {
            log.error("Upload failed: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new IOException("Upload failed: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("Upload error: {}", e.getMessage());
            throw new IOException("Upload error: " + e.getMessage());
        }
    }
}
