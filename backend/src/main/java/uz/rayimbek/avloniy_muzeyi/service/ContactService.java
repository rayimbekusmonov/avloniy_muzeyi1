package uz.rayimbek.avloniy_muzeyi.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import uz.rayimbek.avloniy_muzeyi.dto.request.ContactRequest;
import uz.rayimbek.avloniy_muzeyi.dto.response.ContactResponse;
import uz.rayimbek.avloniy_muzeyi.entity.Contact;
import uz.rayimbek.avloniy_muzeyi.exception.ResourceNotFoundException;
import uz.rayimbek.avloniy_muzeyi.repository.ContactRepository;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;

    public void send(ContactRequest request) {
        Contact contact = Contact.builder()
                .name(request.getName())
                .phone(request.getPhone())
                .telegram(request.getTelegram())
                .subject(request.getSubject())
                .message(request.getMessage())
                .read(false)
                .build();
        contactRepository.save(contact);
    }

    public Page<ContactResponse> getAll(int page, int size) {
        return contactRepository
                .findAllByOrderByCreatedAtDesc(PageRequest.of(page, size))
                .map(this::toResponse);
    }

    public Page<ContactResponse> getUnread(int page, int size) {
        return contactRepository
                .findAllByReadFalseOrderByCreatedAtDesc(PageRequest.of(page, size))
                .map(this::toResponse);
    }

    public long countUnread() {
        return contactRepository.countByReadFalse();
    }

    public ContactResponse markAsRead(Long id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Xabar", id));
        contact.setRead(true);
        return toResponse(contactRepository.save(contact));
    }

    public void delete(Long id) {
        if (!contactRepository.existsById(id)) {
            throw new ResourceNotFoundException("Xabar", id);
        }
        contactRepository.deleteById(id);
    }

    private ContactResponse toResponse(Contact contact) {
        return ContactResponse.builder()
                .id(contact.getId())
                .name(contact.getName())
                .phone(contact.getPhone())
                .telegram(contact.getTelegram())
                .subject(contact.getSubject())
                .message(contact.getMessage())
                .read(contact.getRead())
                .createdAt(contact.getCreatedAt())
                .build();
    }
}
