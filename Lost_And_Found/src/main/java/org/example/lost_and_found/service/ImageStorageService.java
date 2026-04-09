package org.example.lost_and_found.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ImageStorageService {

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            "jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "avif"
    );

    private final Cloudinary cloudinary;

    @Value("${cloudinary.upload-folder:lost-and-found}")
    private String uploadFolder;

    @Value("${cloudinary.cloud-name:}")
    private String cloudName;

    @Value("${cloudinary.api-key:}")
    private String apiKey;

    @Value("${cloudinary.api-secret:}")
    private String apiSecret;

    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Please choose an image to upload");
        }

        if (cloudName.isBlank() || apiKey.isBlank() || apiSecret.isBlank()) {
            throw new RuntimeException("Cloudinary is not configured on the backend");
        }

        String originalFilename = StringUtils.cleanPath(
                file.getOriginalFilename() == null ? "" : file.getOriginalFilename()
        );
        String extension = getExtension(originalFilename);

        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new RuntimeException("Only image files are allowed");
        }

        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", uploadFolder,
                            "resource_type", "image"
                    )
            );

            Object secureUrl = uploadResult.get("secure_url");
            if (secureUrl == null) {
                throw new RuntimeException("Cloudinary did not return an image URL");
            }

            return secureUrl.toString();
        } catch (IOException exception) {
            throw new RuntimeException("Failed to upload image to Cloudinary");
        }
    }

    private String getExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex < 0 || lastDotIndex == fileName.length() - 1) {
            throw new RuntimeException("Image file must include a valid extension");
        }

        return fileName.substring(lastDotIndex + 1);
    }
}
