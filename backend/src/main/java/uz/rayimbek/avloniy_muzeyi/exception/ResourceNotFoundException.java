package uz.rayimbek.avloniy_muzeyi.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resource, Long id) {
        super(resource + " topilmadi: " + id);
    }

    public ResourceNotFoundException(String resource, String identifier) {
        super(resource + " topilmadi: " + identifier);
    }
}
