
    // Check token in localStorage
if (!localStorage.getItem("token_full")) {
    window.location.href = "login.php"; // redirect to login page
} 
document.getElementById("logoutBtn").addEventListener("click", function(e) {
    e.preventDefault();

    // Clear localStorage
    localStorage.removeItem("token_full");

    // Redirect to login
    window.location.href = "login.html";
});

document.addEventListener('DOMContentLoaded', () => {
    const profileModalEl = document.getElementById('profileModal');
    const profileModal = new bootstrap.Modal(profileModalEl);

    const userIdInput = document.getElementById('user-id');
    const userNameInput = document.getElementById('user-name');
    const userEmailInput = document.getElementById('user-email');
    const userPasswordInput = document.getElementById('user-password');
    const saveBtn = document.getElementById('saveProfileChanges');

    const token = localStorage.getItem('token_full');
    if(!token){
        console.error('No auth token found!');
        return;
    }

    const authHeaders = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    // When modal opens, fetch user data
    profileModalEl.addEventListener('show.bs.modal', async () => {
        try {
            const res = await fetch('https://1b690f1d6b1a.ngrok-free.app/api/me', { headers: authHeaders });
            if(!res.ok) throw new Error('Failed to fetch profile');
            const data = await res.json();

            userIdInput.value = data.id;
            userNameInput.value = data.name;
            userEmailInput.value = data.email;
            userPasswordInput.value = '';
        } catch(err) {
            alert('Error fetching profile: ' + err.message);
        }
    });

    // Save changes
    saveBtn.addEventListener('click', async () => {
        const payload = {
            name: userNameInput.value,
            email: userEmailInput.value
        };
        if(userPasswordInput.value.trim() !== ''){
            payload.password = userPasswordInput.value;
        }

        try {
            const res = await fetch(`https://1b690f1d6b1a.ngrok-free.app/api/users/${userIdInput.value}`, {
                method: 'PUT',
                headers: authHeaders,
                body: JSON.stringify(payload)
            });

            const result = await res.json();

            if(res.ok){
                alert(result.message || 'Profile updated successfully!');
                profileModal.hide();
            } else {
                alert(result.message || JSON.stringify(result));
            }
        } catch(err){
            alert('Error: ' + err.message);
        }
    });
});



        function showLoading() {
            document.getElementById('globalLoading').style.display = 'flex';
        }

        function hideLoading() {
            document.getElementById('globalLoading').style.display = 'none';
        }


        document.addEventListener("DOMContentLoaded", () => {
            const admissionForm = document.getElementById("admissionForm");
            const fileInputs = document.querySelectorAll('input[type="file"]');
            const mobileInput = document.getElementById("mobile");
            const whatsappInput = document.getElementById("whatsapp");
            const sameAsMobile = document.getElementById("sameAsMobile");
            const dobInput = document.getElementById("dob");
            const dobWordsInput = document.getElementById("dobWords");
            const transportYes = document.getElementById("transportYes");
            const transportNo = document.getElementById("transportNo");
            const stoppage = document.getElementById("stoppage");
            const submitBtn = document.getElementById("submitAdmission");
            const registrationInput = document.getElementById("registrationNumber");

            // WhatsApp = Mobile
            sameAsMobile.addEventListener("change", () => {
                whatsappInput.value = sameAsMobile.checked ? mobileInput.value : "";
            });
            mobileInput.addEventListener("input", () => {
                if (sameAsMobile.checked) whatsappInput.value = mobileInput.value;
            });

            // DOB in words
            dobInput.addEventListener("input", () => {
                if (dobInput.value) {
                    const [year, month, day] = dobInput.value.split("-");
                    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    dobWordsInput.value = `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
                } else dobWordsInput.value = "";
            });

            // Transport toggle
            stoppage.disabled = true;
            transportYes.addEventListener("change", () => { stoppage.disabled = !transportYes.checked; });
            transportNo.addEventListener("change", () => { stoppage.disabled = transportNo.checked; });

            // File preview
            fileInputs.forEach(input => {
                const preview = document.getElementById("preview" + input.id.charAt(0).toUpperCase() + input.id.slice(1));
                input.addEventListener("change", () => {
                    preview.innerHTML = "";
                    if (input.files.length > 0) {
                        const file = input.files[0];
                        let element;
                        if (file.type.startsWith("image/")) {
                            element = document.createElement("img");
                            element.src = URL.createObjectURL(file);
                            element.style.maxWidth = "100%";
                            element.style.maxHeight = "150px";
                            element.onload = () => URL.revokeObjectURL(element.src);
                        } else {
                            element = document.createElement("p");
                            element.textContent = file.name;
                        }
                        preview.appendChild(element);
                    }
                });
            });

            // Form submission
            admissionForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                submitBtn.disabled = true;
                submitBtn.textContent = "Submitting...";
                showLoading(); // show loader


                try {
                    const token = localStorage.getItem("token_full");
                    if (!token) throw new Error("No authentication token found");

                    // Teacher manually entered registration number
                    const registrationNo = registrationInput.value.trim();
                    if (!registrationNo) throw new Error("Please enter registration number manually");

                    const formData = new FormData();
                    formData.append("student_name", document.getElementById("studentName").value);
                    formData.append("email", document.getElementById("email").value);
                    formData.append("father_name", document.getElementById("fatherName").value);
                    formData.append("mother_name", document.getElementById("motherName").value);
                    formData.append("class_applied", document.getElementById("class").value);
                    formData.append("dob", document.getElementById("dob").value);
                    formData.append("dob_words", dobWordsInput.value);
                    formData.append("gender", document.getElementById("gender")?.value || "");
                    formData.append("mobile", mobileInput.value);
                    formData.append("whatsapp", whatsappInput.value);
                    formData.append("address", document.getElementById("address").value);
                    formData.append("parent_email", document.getElementById("parentEmail").value);
                    formData.append("parent_occupation", document.getElementById("parentOccupation")?.value || "");
                    formData.append("prev_school_details", document.getElementById("previousSchool").value);
                    formData.append("permanent_edu_no", document.getElementById("permanentEduNo").value);
                    formData.append("appar_id_no", document.getElementById("apparId").value);
                    formData.append("subject_opted", document.getElementById("subjectRow").style.display !== "none" ? document.getElementById("subjectOpted").value : "");
                    formData.append("registration_no", registrationNo);
                    formData.append("transport_facility", document.querySelector('input[name="transport"]:checked')?.value || "");
                    formData.append("transport_stoppage", stoppage.value || "");

                    // Append files
                    const filesMap = {
                        studentPhoto: "student_photo",
                        birthCertificate: "birth_certificate",
                        studentAadhar: "student_aadhar",
                        fatherAadhar: "father_aadhar",
                        motherAadhar: "mother_aadhar",
                        transferCertificate: "transfer_certificate",
                        medicalCertificate: "medical_certificate"
                    };
                    for (const inputId in filesMap) {
                        const input = document.getElementById(inputId);
                        if (input && input.files.length > 0) {
                            formData.append(filesMap[inputId], input.files[0]);
                        }
                    }

                    // Submit to backend
                    const res = await fetch("https://1b690f1d6b1a.ngrok-free.app/api/admissions", {
                        method: "POST",
                        headers: { "Authorization": `Bearer ${token}` },
                        body: formData
                    });

                    if (!res.ok) {
                        const errorText = await res.text();
                        throw new Error(`Server responded with ${res.status}: ${errorText}`);
                    }

                    const result = await res.json();
                    alert("Admission submitted successfully! ID: " + result.id);
                    admissionForm.reset();
                    fileInputs.forEach(f => {
                        const preview = document.getElementById("preview" + f.id.charAt(0).toUpperCase() + f.id.slice(1));
                        preview.innerHTML = "";
                    });
                    bootstrap.Modal.getInstance(document.getElementById('admissionModal'))?.hide();

                } catch (err) {
                    console.error("Error submitting admission:", err);
                    alert("Failed to submit admission: " + err.message);
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Submit Admission";
                    hideLoading(); // hide loader
                }
            });
        });


        async function fetchDashboardStats() {
            const token = localStorage.getItem('token_full');
            if (!token) return;

            const authHeaders = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };

            try {
                const res = await fetch('https://1b690f1d6b1a.ngrok-free.app/api/dashboard-stats', {
                    headers: authHeaders
                });

                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

                const data = await res.json();

                // Update HTML elements
                document.getElementById('totalAdmissions').innerText = data.total_admissions || 0;
                document.getElementById('todaysAdmissions').innerText = data.todays_admissions || 0;
                document.getElementById('classCount').innerText = `${data.class_count || 0} Classes`;
                document.getElementById('pendingAdmissions').innerText = data.pending || 0;

            } catch (err) {
                console.error('Error fetching dashboard stats:', err);
            }
        }

        // Call it once page loads
        fetchDashboardStats();

   
        document.addEventListener('DOMContentLoaded', () => {
            const viewModal = new bootstrap.Modal(document.getElementById('viewAdmissionModal'));
            const editModal = new bootstrap.Modal(document.getElementById('editAdmissionModal'));
            const deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));

            // Check if token exists
            const token = localStorage.getItem('token_full');
            if (!token) {
                console.error('No authentication token found');
                alert('Please login first');
                return;
            }

            const authHeaders = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };

            const admissionsTableBody = document.getElementById('admissionsTableBody');
            const searchInput = document.getElementById('searchName');
            const classFilter = document.getElementById('filterClass');
            const dateFilter = document.getElementById('filterDate');

            let admissionsData = [];
            let currentPage = 1;
            const perPage = 10;
            let searchTimeout;

            // Debounced search for better performance
            function setupSearchDebounce() {
                [searchInput, classFilter, dateFilter].forEach(el => {
                    if (el) {
                        el.addEventListener('input', () => {
                            clearTimeout(searchTimeout);
                            searchTimeout = setTimeout(() => {
                                currentPage = 1;
                                fetchAdmissions();
                            }, 300); // 300ms delay
                        });
                    }
                });
            }

            // Fast Fetch Admissions from API
            async function fetchAdmissions() {
                const params = new URLSearchParams();
                if (searchInput.value) params.append('search', searchInput.value);
                if (classFilter.value) params.append('class', classFilter.value);
                if (dateFilter.value) params.append('date', dateFilter.value);
                params.append('page', currentPage);
                params.append('per_page', perPage);

                try {

                    // Show loading state
                    admissionsTableBody.innerHTML = '<tr><td colspan="11" class="text-center"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>';

                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

                    const res = await fetch(`https://1b690f1d6b1a.ngrok-free.app/api/admissions?${params.toString()}`, {
                        headers: authHeaders,
                        signal: controller.signal
                    });

                    clearTimeout(timeoutId);

                    if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`);
                    }

                    const data = await res.json();
                    admissionsData = data.data || [];
                    renderTable(admissionsData);
                    renderPagination(data.total || data.meta?.total || 0);
                } catch (err) {
                    console.error('Error fetching admissions:', err);
                    admissionsTableBody.innerHTML = `<tr><td colspan="11" class="text-center text-danger">Error loading data: ${err.message}</td></tr>`;
                }
            }

            // Optimized Table Render - Updated to show more columns
            function renderTable(data) {
                if (data.length === 0) {
                    admissionsTableBody.innerHTML = '<tr><td colspan="11" class="text-center">No admissions found</td></tr>';
                    return;
                }

                // Use document fragment for faster DOM manipulation
                const fragment = document.createDocumentFragment();

                data.forEach(adm => {
                    const tr = document.createElement('tr');
                    tr.dataset.id = adm.id;
                    tr.innerHTML = `
                <td>${escapeHtml(adm.student_name || '-')}</td>
                <td>${escapeHtml(adm.class_applied || '-')}</td>
                <td>${escapeHtml(adm.section || '-')}</td>
                <td>${escapeHtml(adm.father_name || '-')}</td>
                <td>${escapeHtml(adm.mother_name || '-')}</td>
                <td>+91 ${escapeHtml(adm.mobile || '-')}</td>
                <td>${escapeHtml(adm.gender || '-')}</td>
                <td>${escapeHtml(adm.dob ? new Date(adm.dob).toLocaleDateString() : '-')}</td>
                <td>${escapeHtml(adm.status || '-')}</td>
                <td>${escapeHtml(adm.registration_no || '-')}</td>
                <td>
                    <button class="btn btn-sm btn-info view-btn" data-id="${adm.id}" title="View Details"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-sm btn-warning edit-btn" data-id="${adm.id}" title="Edit Admission"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${adm.id}" title="Delete Admission"><i class="fas fa-trash"></i></button>
                </td>
            `;
                    fragment.appendChild(tr);
                });

                admissionsTableBody.innerHTML = '';
                admissionsTableBody.appendChild(fragment);
                attachRowActions();
            }

            // Escape HTML to prevent XSS
            function escapeHtml(unsafe) {
                if (unsafe === null || unsafe === undefined) return '-';
                return String(unsafe)
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;");
            }

            // Render Pagination
            function renderPagination(total) {
                const paginationContainer = document.getElementById('pagination');
                const totalPages = Math.ceil(total / perPage);

                if (totalPages <= 1) {
                    paginationContainer.innerHTML = '';
                    return;
                }

                const fragment = document.createDocumentFragment();

                // Previous button
                const prevLi = createPaginationItem('Previous', currentPage === 1, () => {
                    if (currentPage > 1) {
                        currentPage--;
                        fetchAdmissions();
                    }
                });
                fragment.appendChild(prevLi);

                // Page numbers - show limited pages for performance
                const startPage = Math.max(1, currentPage - 2);
                const endPage = Math.min(totalPages, currentPage + 2);

                for (let i = startPage; i <= endPage; i++) {
                    const li = createPaginationItem(i, i === currentPage, () => {
                        currentPage = i;
                        fetchAdmissions();
                    });
                    fragment.appendChild(li);
                }

                // Next button
                const nextLi = createPaginationItem('Next', currentPage === totalPages, () => {
                    if (currentPage < totalPages) {
                        currentPage++;
                        fetchAdmissions();
                    }
                });
                fragment.appendChild(nextLi);

                paginationContainer.innerHTML = '';
                paginationContainer.appendChild(fragment);
            }

            function createPaginationItem(content, disabled, onClick) {
                const li = document.createElement('li');
                li.className = `page-item ${disabled ? 'disabled' : ''}`;
                li.innerHTML = `<a class="page-link" href="#">${content}</a>`;
                if (!disabled) {
                    li.addEventListener('click', (e) => {
                        e.preventDefault();
                        onClick();
                    });
                }
                return li;
            }

            // Efficient event delegation for actions
            function attachRowActions() {
                admissionsTableBody.addEventListener('click', (e) => {
                    const target = e.target.closest('.view-btn, .edit-btn, .delete-btn');
                    if (!target) return;

                    const admissionId = target.dataset.id;

                    if (target.classList.contains('view-btn')) {
                        showViewModal(admissionId);
                    } else if (target.classList.contains('edit-btn')) {
                        showEditModal(admissionId);
                    } else if (target.classList.contains('delete-btn')) {
                        document.getElementById('delete-student-id').value = admissionId;
                        deleteModal.show();
                    }
                });
            }

            // Optimized modal functions
            async function showViewModal(admissionId) {
                document.getElementById('viewAdmissionBody').innerHTML = '<div class="text-center"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
                viewModal.show();

                try {
                    const res = await fetch(`https://1b690f1d6b1a.ngrok-free.app/api/admissions/${admissionId}`, {
                        headers: authHeaders
                    });

                    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

                    const data = await res.json();
                    populateViewModal(data);
                } catch (err) {
                    console.error('Error loading view data:', err);
                    document.getElementById('viewAdmissionBody').innerHTML = `<div class="text-danger text-center">Error loading data: ${err.message}</div>`;
                }
            }

            async function showEditModal(admissionId) {
                document.getElementById('editAdmissionBody').innerHTML = '<div class="text-center"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
                editModal.show();

                try {
                    const res = await fetch(`https://1b690f1d6b1a.ngrok-free.app/api/admissions/${admissionId}`, {
                        headers: authHeaders
                    });

                    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

                    const data = await res.json();
                    populateEditForm(data);
                } catch (err) {
                    console.error('Error loading edit data:', err);
                    document.getElementById('editAdmissionBody').innerHTML = `<div class="text-danger text-center">Error loading data: ${err.message}</div>`;
                }
            }

            // Enhanced View Modal with all fields
            function populateViewModal(data) {
                // Create file preview links
                const createFileLink = (filePath, fieldName) => {
                    if (!filePath) return '-';
                    const fileName = filePath.split('/').pop();
                    return `<a href="https://1b690f1d6b1a.ngrok-free.app/${filePath}" target="_blank" class="file-link">${fileName}</a>`;
                };

                document.getElementById('viewAdmissionBody').innerHTML = `
            <div class="row">
                <!-- Basic Information -->
                <div class="col-12 mb-4">
                    <h6 class="section-title border-bottom pb-2">Basic Information</h6>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label"><strong>Student Name:</strong></label>
                    <div class="view-field">${escapeHtml(data.student_name || '-')}</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label"><strong>Date of Birth:</strong></label>
                    <div class="view-field">${data.dob || '-'} ${data.dob_words ? `(${data.dob_words})` : ''}</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label"><strong>Gender:</strong></label>
                    <div class="view-field">${escapeHtml(data.gender || '-')}</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label"><strong>Mobile:</strong></label>
                    <div class="view-field">+91 ${escapeHtml(data.mobile || '-')}</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label"><strong>WhatsApp:</strong></label>
                    <div class="view-field">+91 ${escapeHtml(data.whatsapp || '-')}</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label"><strong>Email:</strong></label>
                    <div class="view-field">${escapeHtml(data.email || '-')}</div>
                </div>
                <div class="col-12 mb-3">
                    <label class="form-label"><strong>Address:</strong></label>
                    <div class="view-field">${escapeHtml(data.address || '-')}</div>
                </div>

                <!-- Academic Information -->
                <div class="col-12 mb-4 mt-3">
                    <h6 class="section-title border-bottom pb-2">Academic Information</h6>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label"><strong>Class Applied:</strong></label>
                    <div class="view-field">${escapeHtml(data.class_applied || '-')}</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label"><strong>Section:</strong></label>
                    <div class="view-field">${escapeHtml(data.section || '-')}</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label"><strong>Registration No:</strong></label>
                    <div class="view-field">${escapeHtml(data.registration_no || '-')}</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label"><strong>Subject Opted:</strong></label>
                    <div class="view-field">${escapeHtml(data.subject_opted || '-')}</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label"><strong>Permanent Education No:</strong></label>
                    <div class="view-field">${escapeHtml(data.permanent_edu_no || '-')}</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label"><strong>Appar ID No:</strong></label>
                    <div class="view-field">${escapeHtml(data.appar_id_no || '-')}</div>
                </div>
                <div class="col-12 mb-3">
                    <label class="form-label"><strong>Previous School Details:</strong></label>
                    <div class="view-field">${escapeHtml(data.prev_school_details || '-')}</div>
                </div>

                <!-- Parent Information -->
                <div class="col-12 mb-4 mt-3">
                    <h6 class="section-title border-bottom pb-2">Parent Information</h6>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label"><strong>Father's Name:</strong></label>
                    <div class="view-field">${escapeHtml(data.father_name || '-')}</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label"><strong>Mother's Name:</strong></label>
                    <div class="view-field">${escapeHtml(data.mother_name || '-')}</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label"><strong>Parent Email:</strong></label>
                    <div class="view-field">${escapeHtml(data.parent_email || '-')}</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label"><strong>Parent Occupation:</strong></label>
                    <div class="view-field">${escapeHtml(data.parent_occupation || '-')}</div>
                </div>

                <!-- Transport Information -->
                <div class="col-12 mb-4 mt-3">
                    <h6 class="section-title border-bottom pb-2">Transport Information</h6>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label"><strong>Transport Facility:</strong></label>
                    <div class="view-field">${escapeHtml(data.transport_facility || '-')}</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label"><strong>Transport Stoppage:</strong></label>
                    <div class="view-field">${escapeHtml(data.transport_stoppage || '-')}</div>
                </div>

                <!-- File Uploads -->
                <div class="col-12 mb-4 mt-3">
                    <h6 class="section-title border-bottom pb-2">Uploaded Documents</h6>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label"><strong>Student Photo:</strong></label>
                    <div class="view-field">${createFileLink(data.student_photo, 'Student Photo')}</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label"><strong>Birth Certificate:</strong></label>
                    <div class="view-field">${createFileLink(data.birth_certificate, 'Birth Certificate')}</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label"><strong>Student Aadhar:</strong></label>
                    <div class="view-field">${createFileLink(data.student_aadhar, 'Student Aadhar')}</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label"><strong>Father's Aadhar:</strong></label>
                    <div class="view-field">${createFileLink(data.father_aadhar, 'Father Aadhar')}</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label"><strong>Mother's Aadhar:</strong></label>
                    <div class="view-field">${createFileLink(data.mother_aadhar, 'Mother Aadhar')}</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label"><strong>Transfer Certificate:</strong></label>
                    <div class="view-field">${createFileLink(data.transfer_certificate, 'Transfer Certificate')}</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label"><strong>Medical Certificate:</strong></label>
                    <div class="view-field">${createFileLink(data.medical_certificate, 'Medical Certificate')}</div>
                </div>

                <!-- Status Information -->
                <div class="col-12 mb-4 mt-3">
                    <h6 class="section-title border-bottom pb-2">Status Information</h6>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label"><strong>Status:</strong></label>
                    <div class="view-field">
                        <span class="badge ${getStatusBadgeClass(data.status)}">${escapeHtml(data.status || 'Pending')}</span>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label"><strong>Created At:</strong></label>
                    <div class="view-field">${data.created_at ? new Date(data.created_at).toLocaleString() : '-'}</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label"><strong>Updated At:</strong></label>
                    <div class="view-field">${data.updated_at ? new Date(data.updated_at).toLocaleString() : '-'}</div>
                </div>
            </div>
        `;
            }

            // Helper function for status badge classes
            function getStatusBadgeClass(status) {
                switch (status?.toLowerCase()) {
                    case 'approved': return 'bg-success';
                    case 'rejected': return 'bg-danger';
                    case 'pending': return 'bg-warning';
                    default: return 'bg-secondary';
                }
            }

            // Enhanced Edit Form with all fields
            function populateEditForm(data) {
                document.getElementById('editAdmissionBody').innerHTML = `
            <form id="editForm">
                <input type="hidden" id="edit-id" name="id" value="${data.id}">
                
                <!-- Basic Information -->
                <div class="row mb-3">
                    <div class="col-12">
                        <h6 class="section-title border-bottom pb-2">Basic Information</h6>
                    </div>
                    <div class="col-md-6">
                        <label for="edit-student-name" class="form-label">Student Name *</label>
                        <input type="text" class="form-control" id="edit-student-name" name="student_name" value="${data.student_name || ''}" required>
                    </div>
                   
                </div>

                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="edit-dob" class="form-label">Date of Birth *</label>
                        <input type="date" class="form-control" id="edit-dob" name="dob" value="${data.dob || ''}" required>
                    </div>
                    <div class="col-md-6">
                        <label for="edit-gender" class="form-label">Gender</label>
                        <select class="form-select" id="edit-gender" name="gender">
                            <option value="">Select Gender</option>
                            <option value="Male" ${data.gender === 'Male' ? 'selected' : ''}>Male</option>
                            <option value="Female" ${data.gender === 'Female' ? 'selected' : ''}>Female</option>
                            <option value="Other" ${data.gender === 'Other' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                </div>

                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="edit-mobile" class="form-label">Mobile Number</label>
                        <div class="input-group">
                            <span class="input-group-text">+91</span>
                            <input type="tel" class="form-control" id="edit-mobile" name="mobile" value="${data.mobile || ''}">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label for="edit-whatsapp" class="form-label">WhatsApp Number</label>
                        <div class="input-group">
                            <span class="input-group-text">+91</span>
                            <input type="tel" class="form-control" id="edit-whatsapp" name="whatsapp" value="${data.whatsapp || ''}">
                        </div>
                    </div>
                </div>

                <div class="row mb-3">
                    <div class="col-12">
                        <label for="edit-address" class="form-label">Address</label>
                        <textarea class="form-control" id="edit-address" name="address" rows="3">${data.address || ''}</textarea>
                    </div>
                </div>

                <!-- Academic Information -->
                <div class="row mb-3">
                    <div class="col-12">
                        <h6 class="section-title border-bottom pb-2">Academic Information</h6>
                    </div>
                    <div class="col-md-6">
                        <label for="edit-class-applied" class="form-label">Class Applied *</label>
                        <select class="form-select" id="edit-class-applied" name="class_applied" required>
                            <option value="" disabled>Select Class</option>
                            ${['Class I', 'Class II', 'Class III', 'Class IV', 'Class V', 'Class VI', 'Class VII', 'Class VIII', 'Class IX', 'Class X']
                        .map(c => `<option value="${c}" ${data.class_applied === c ? 'selected' : ''}>${c}</option>`).join('')}
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label for="edit-section" class="form-label">Section</label>
                        <input type="text" class="form-control" id="edit-section" name="section" value="${data.section || ''}">
                    </div>
                </div>

                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="edit-permanent-edu-no" class="form-label">Permanent Education No</label>
                        <input type="text" class="form-control" id="edit-permanent-edu-no" name="permanent_edu_no" value="${data.permanent_edu_no || ''}">
                    </div>
                    <div class="col-md-6">
                        <label for="edit-appar-id" class="form-label">Appar ID No</label>
                        <input type="text" class="form-control" id="edit-appar-id" name="appar_id_no" value="${data.appar_id_no || ''}">
                    </div>
                </div>

                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="edit-registration-no" class="form-label">Registration No</label>
                        <input type="text" class="form-control" id="edit-registration-no" name="registration_no" value="${data.registration_no || ''}">
                    </div>
                    <div class="col-md-6">
                        <label for="edit-subject-opted" class="form-label">Subject Opted</label>
                        <select class="form-select" id="edit-subject-opted" name="subject_opted">
                            <option value="">Select Subject</option>
                            <option value="Hindi" ${data.subject_opted === 'Hindi' ? 'selected' : ''}>Hindi</option>
                            <option value="Sanskrit" ${data.subject_opted === 'Sanskrit' ? 'selected' : ''}>Sanskrit</option>
                        </select>
                    </div>
                </div>

                <div class="row mb-3">
                    <div class="col-12">
                        <label for="edit-prev-school" class="form-label">Previous School Details</label>
                        <textarea class="form-control" id="edit-prev-school" name="prev_school_details" rows="3">${data.prev_school_details || ''}</textarea>
                    </div>
                </div>

                <!-- Parent Information -->
                <div class="row mb-3">
                    <div class="col-12">
                        <h6 class="section-title border-bottom pb-2">Parent Information</h6>
                    </div>
                    <div class="col-md-6">
                        <label for="edit-father-name" class="form-label">Father Name</label>
                        <input type="text" class="form-control" id="edit-father-name" name="father_name" value="${data.father_name || ''}">
                    </div>
                    <div class="col-md-6">
                        <label for="edit-mother-name" class="form-label">Mother Name</label>
                        <input type="text" class="form-control" id="edit-mother-name" name="mother_name" value="${data.mother_name || ''}">
                    </div>
                </div>

                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="edit-parent-email" class="form-label">Parent Email</label>
                        <input type="email" class="form-control" id="edit-parent-email" name="parent_email" value="${data.parent_email || ''}">
                    </div>
                    <div class="col-md-6">
                        <label for="edit-parent-occupation" class="form-label">Parent Occupation</label>
                        <input type="text" class="form-control" id="edit-parent-occupation" name="parent_occupation" value="${data.parent_occupation || ''}">
                    </div>
                </div>

                <!-- Transport Information -->
                <div class="row mb-3">
                    <div class="col-12">
                        <h6 class="section-title border-bottom pb-2">Transport Information</h6>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Transport Facility</label>
                        <div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="transport_facility" id="edit-transport-yes" value="Yes" ${data.transport_facility === 'Yes' ? 'checked' : ''}>
                                <label class="form-check-label" for="edit-transport-yes">Yes</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="transport_facility" id="edit-transport-no" value="No" ${data.transport_facility !== 'Yes' ? 'checked' : ''}>
                                <label class="form-check-label" for="edit-transport-no">No</label>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label for="edit-transport-stoppage" class="form-label">Transport Stoppage</label>
                        <input type="text" class="form-control" id="edit-transport-stoppage" name="transport_stoppage" value="${data.transport_stoppage || ''}">
                    </div>
                </div>

                <!-- Status Information -->
                <div class="row mb-3">
                    <div class="col-12">
                        <h6 class="section-title border-bottom pb-2">Status Information</h6>
                    </div>
                    <div class="col-md-6">
                        <label for="edit-status" class="form-label">Status</label>
                        <select class="form-select" id="edit-status" name="status">
                            <option value="Pending" ${data.status === 'Pending' ? 'selected' : ''}>Pending</option>
                            <option value="Approved" ${data.status === 'Approved' ? 'selected' : ''}>Approved</option>
                            <option value="Rejected" ${data.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                        </select>
                    </div>
                </div>
            </form>
        `;
            }

            // Save Edit Form
            document.getElementById('saveAdmissionChanges').addEventListener('click', async () => {
                const form = document.getElementById('editForm');
                const admissionId = document.getElementById('edit-id').value;
                const formData = Object.fromEntries(new FormData(form).entries());
                showLoading(); // show loader
                try {

                    const res = await fetch(`https://1b690f1d6b1a.ngrok-free.app/api/admissions/${admissionId}`, {
                        method: 'PUT',
                        headers: authHeaders,
                        body: JSON.stringify(formData)
                    });

                    if (res.ok) {
                        hideLoading(); // hide loader
                        alert('Admission updated successfully!');
                        editModal.hide();
                        fetchAdmissions();

                    } else {
                        const errorData = await res.json();
                        alert(`Error updating admission: ${errorData.message || 'Unknown error'}`);
                    }
                } catch (err) {
                    alert('Error updating admission: ' + err.message);
                }
            });

            // Delete Student
            document.getElementById('confirmDelete').addEventListener('click', async () => {
                const admissionId = document.getElementById('delete-student-id').value;
                showLoading(); // show loader
                try {
                    const res = await fetch(`https://1b690f1d6b1a.ngrok-free.app/api/admissions/${admissionId}`, {
                        method: 'DELETE',
                        headers: authHeaders
                    });

                    if (res.ok) {
                        alert('Student admission deleted successfully!');
                        hideLoading(); // hide loader
                        deleteModal.hide();
                        fetchAdmissions();
                    } else {
                        const errorText = await res.text();
                        let errorMessage = 'Unknown error';

                        try {
                            const errorData = JSON.parse(errorText);
                            errorMessage = errorData.message || errorMessage;
                        } catch (e) {
                            errorMessage = errorText || `HTTP error! status: ${res.status}`;
                        }

                        alert(`Error deleting admission: ${errorMessage}`);
                    }
                } catch (err) {
                    alert('Error deleting admission: ' + err.message);
                }
            });

            // Initialize
            setupSearchDebounce();
            fetchAdmissions();
        });

