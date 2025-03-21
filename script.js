document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const generateBtn = document.getElementById('generateBtn');
    const addSubjectBtn = document.getElementById('addSubjectBtn');
    const subjectsWrapper = document.getElementById('subjectsWrapper');
    const resultSection = document.getElementById('resultSection');
    const routineTable = document.getElementById('routineTable');
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    
    // Initialize with a placeholder logo if needed
    const logoImg = document.querySelector('.logo');
    logoImg.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Ccircle cx='30' cy='30' r='30' fill='%233498db'/%3E%3Cpath d='M20 25c0-5.523 4.477-10 10-10s10 4.477 10 10c0 5.523-4.477 10-10 10S20 30.523 20 25zM45 45H15c0-7.18 6.82-13 15-13s15 5.82 15 13z' fill='%23ffffff'/%3E%3C/svg%3E";

    // Theme Toggle
    themeToggle.addEventListener('change', function() {
        document.body.classList.toggle('dark-mode');
    });
    
    // Add initial subject entry
    addSubjectEntry();

    // Event Listeners
    addSubjectBtn.addEventListener('click', addSubjectEntry);
    generateBtn.addEventListener('click', generateRoutine);
    exportPdfBtn.addEventListener('click', exportToPDF);
    
    // Add subject entry
    function addSubjectEntry() {
        const subjectEntry = document.createElement('div');
        subjectEntry.className = 'subject-entry';
        
        subjectEntry.innerHTML = `
            <input type="text" placeholder="Subject Name" class="subject-name">
            <div class="faculty-list">
                <input type="text" placeholder="Faculty Name" class="faculty-name">
                <button type="button" class="add-faculty-btn">+</button>
            </div>
        `;
        
        subjectsWrapper.appendChild(subjectEntry);
        
        // Add event listener to the new add faculty button
        const addFacultyBtn = subjectEntry.querySelector('.add-faculty-btn');
        addFacultyBtn.addEventListener('click', function() {
            addFacultyField(this.parentElement);
        });
    }
    
    // Add faculty field
    function addFacultyField(facultyList) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Faculty Name';
        input.className = 'faculty-name';
        
        // Insert before the add button
        facultyList.insertBefore(input, facultyList.querySelector('.add-faculty-btn'));
    }
    
    // Generate Routine
    function generateRoutine() {
        // Collect form data
        const startTime = document.getElementById('startTime').value;
        const classDuration = parseInt(document.getElementById('classDuration').value);
        const maxPeriods = parseInt(document.getElementById('maxPeriods').value);
        const minPeriods = parseInt(document.getElementById('minPeriods').value);
        const tiffinDuration = parseInt(document.getElementById('tiffinDuration').value);
        const tiffinAfter = parseInt(document.getElementById('tiffinAfter').value);
        
        // Collect subjects and faculty
        const subjects = [];
        const subjectEntries = document.querySelectorAll('.subject-entry');
        
        subjectEntries.forEach(entry => {
            const subjectName = entry.querySelector('.subject-name').value.trim();
            const facultyInputs = entry.querySelectorAll('.faculty-name');
            const facultyList = [];
            
            facultyInputs.forEach(input => {
                const name = input.value.trim();
                if (name) facultyList.push(name);
            });
            
            if (subjectName && facultyList.length > 0) {
                subjects.push({
                    name: subjectName,
                    faculty: facultyList
                });
            }
        });
        
        // Collect selected days
        const selectedDays = [];
        document.querySelectorAll('.day-checkbox:checked').forEach(checkbox => {
            selectedDays.push(checkbox.value);
        });
        
        // Validate inputs
        if (!validateInputs(startTime, classDuration, maxPeriods, minPeriods, tiffinDuration, tiffinAfter, subjects, selectedDays)) {
            return;
        }
        
        // Create the routine
        createRoutineTable(startTime, classDuration, maxPeriods, minPeriods, tiffinDuration, tiffinAfter, subjects, selectedDays);
        
        // Show result section
        resultSection.style.display = 'block';
        
        // Scroll to result section
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Validate inputs
    function validateInputs(startTime, classDuration, maxPeriods, minPeriods, tiffinDuration, tiffinAfter, subjects, selectedDays) {
        if (!startTime) {
            alert('Please enter a valid start time');
            return false;
        }
        
        if (classDuration < 30 || classDuration > 120) {
            alert('Class duration should be between 30 and 120 minutes');
            return false;
        }
        
        if (maxPeriods < 4 || maxPeriods > 10) {
            alert('Max periods should be between 4 and 10');
            return false;
        }
        
        if (minPeriods < 3 || minPeriods > maxPeriods) {
            alert(`Min periods should be between 3 and ${maxPeriods}`);
            return false;
        }
        
        if (tiffinDuration < 15 || tiffinDuration > 60) {
            alert('Tiffin duration should be between 15 and 60 minutes');
            return false;
        }
        
        if (tiffinAfter < 2 || tiffinAfter > maxPeriods - 1) {
            alert(`Tiffin should be after a period between 2 and ${maxPeriods - 1}`);
            return false;
        }
        
        if (subjects.length === 0) {
            alert('Please add at least one subject with faculty');
            return false;
        }
        
        if (selectedDays.length === 0) {
            alert('Please select at least one day');
            return false;
        }
        
        return true;
    }
    
    // Create routine table
    function createRoutineTable(startTime, classDuration, maxPeriods, minPeriods, tiffinDuration, tiffinAfter, subjects, selectedDays) {
        // Clear previous table
        routineTable.innerHTML = '';
        
        // Create table header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        // Add empty cell for top-left corner
        const cornerCell = document.createElement('th');
        cornerCell.textContent = 'Day / Period';
        headerRow.appendChild(cornerCell);
        
        // Add period numbers to header (use max periods for header)
        for (let i = 1; i <= maxPeriods; i++) {
            const th = document.createElement('th');
            th.textContent = `Period ${i}`;
            headerRow.appendChild(th);
        }
        
        thead.appendChild(headerRow);
        routineTable.appendChild(thead);
        
        // Create table body
        const tbody = document.createElement('tbody');
        
        // Create routine for each day
        selectedDays.forEach(day => {
            const row = document.createElement('tr');
            
            // Add day cell
            const dayCell = document.createElement('td');
            dayCell.textContent = day;
            dayCell.style.fontWeight = 'bold';
            row.appendChild(dayCell);
            
            // Generate random number of periods for this day
            const periodsForDay = getRandomInt(minPeriods, maxPeriods);
            
            // Calculate time slots for this day
            const timeSlots = calculateTimeSlots(startTime, classDuration, periodsForDay, tiffinDuration, tiffinAfter);
            
            // Generate classes for this day
            const daySchedule = generateDaySchedule(subjects, timeSlots);
            
            // Add cells for each time slot
            let slotIndex = 0;
            for (let i = 0; i < maxPeriods; i++) {
                const td = document.createElement('td');
                
                if (i < daySchedule.length) {
                    const slot = daySchedule[i];
                    
                    if (slot.isTiffin) {
                        td.innerHTML = `<div class="tiffin-cell">TIFFIN<br>${slot.startTime} - ${slot.endTime}</div>`;
                    } else if (slot.subject) {
                        td.innerHTML = `
                            <strong>${slot.subject.name}</strong><br>
                            ${slot.faculty}<br>
                            <span class="time-slot">${slot.startTime} - ${slot.endTime}</span>
                        `;
                    } else {
                        td.innerHTML = `
                            <span class="free-period">Free Period</span><br>
                            <span class="time-slot">${slot.startTime} - ${slot.endTime}</span>
                        `;
                    }
                } else {
                    td.textContent = '-';
                }
                
                row.appendChild(td);
            }
            
            tbody.appendChild(row);
        });
        
        routineTable.appendChild(tbody);
    }
    
    // Get random integer between min and max (inclusive)
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // Calculate time slots
    function calculateTimeSlots(startTime, classDuration, periodsForDay, tiffinDuration, tiffinAfter) {
        const timeSlots = [];
        const [hours, minutes] = startTime.split(':').map(Number);
        
        let currentDate = new Date();
        currentDate.setHours(hours, minutes, 0);
        
        let periodCounter = 1;
        
        for (let i = 0; i < periodsForDay; i++) {
            // Check if it's time for tiffin
            if (periodCounter === tiffinAfter + 1 && i < periodsForDay - 1) {
                const tiffinStartTime = formatTime(currentDate);
                
                // Add tiffin duration
                currentDate = new Date(currentDate.getTime() + tiffinDuration * 60000);
                const tiffinEndTime = formatTime(currentDate);
                
                timeSlots.push({
                    period: null,
                    startTime: tiffinStartTime,
                    endTime: tiffinEndTime,
                    isTiffin: true,
                    label: 'Tiffin'
                });
                
                i--; // Don't count tiffin as a period
                continue;
            }
            
            // Regular class period
            const periodStartTime = formatTime(currentDate);
            
            // Add class duration
            currentDate = new Date(currentDate.getTime() + classDuration * 60000);
            const periodEndTime = formatTime(currentDate);
            
            timeSlots.push({
                period: periodCounter,
                startTime: periodStartTime,
                endTime: periodEndTime,
                isTiffin: false,
                label: `Period ${periodCounter}`
            });
            
            periodCounter++;
        }
        
        return timeSlots;
    }
    
    // Generate day schedule
    function generateDaySchedule(subjects, timeSlots) {
        const schedule = [];
        const usedSubjects = new Set(); // Track subjects used for this day
        
        // Copy the time slots
        timeSlots.forEach(slot => {
            if (slot.isTiffin) {
                schedule.push({
                    isTiffin: true,
                    startTime: slot.startTime,
                    endTime: slot.endTime
                });
            } else {
                // Get available subjects (not yet used today)
                const availableSubjects = subjects.filter(s => !usedSubjects.has(s.name));
                
                // If all subjects used, allow repeats
                const subjectPool = availableSubjects.length > 0 ? availableSubjects : subjects;
                
                // Randomly select a subject
                const randomSubject = subjectPool[Math.floor(Math.random() * subjectPool.length)];
                
                // Mark this subject as used for today
                usedSubjects.add(randomSubject.name);
                
                // Pick a random faculty for this subject
                const randomFaculty = randomSubject.faculty[Math.floor(Math.random() * randomSubject.faculty.length)];
                
                schedule.push({
                    subject: randomSubject,
                    faculty: randomFaculty,
                    isTiffin: false,
                    startTime: slot.startTime,
                    endTime: slot.endTime
                });
            }
        });
        
        return schedule;
    }
    
    // Format time as HH:MM AM/PM
    function formatTime(date) {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
        
        return `${hours}:${minutesStr} ${ampm}`;
    }
    
    // Export to PDF
    function exportToPDF() {
        // Import necessary libraries
        const { jsPDF } = window.jspdf;
        const html2canvas = window.html2canvas;

        // Create a container with title for the PDF
        const container = document.createElement('div');
        container.style.padding = '20px';
        container.style.backgroundColor = 'white';
        container.style.color = 'black';
        
        const title = document.createElement('h2');
        title.textContent = 'Class Routine';
        title.style.textAlign = 'center';
        title.style.marginBottom = '20px';
        title.style.color = '#3498db';
        
        container.appendChild(title);
        container.appendChild(routineTable.cloneNode(true));
        
        // Temporarily append to body (hidden)
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        document.body.appendChild(container);
        
        // Use html2canvas and jsPDF
        html2canvas(container).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            
            // A4 size in mm [width, height]
            const pdf = new jsPDF('landscape', 'mm', 'a4');
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('class-routine.pdf');
            
            // Remove the temporary container
            document.body.removeChild(container);
        });
    }
});