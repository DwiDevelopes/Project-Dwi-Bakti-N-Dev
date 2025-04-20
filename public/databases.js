// File: databases.js
    // Sample image data with titles and categories
    const imageData = Array.from({ length: 358 }, (_, index) => {
        const id = index + 1;
        return {
            id,
            url: `databases/images/games/3 (${id}).png`,
            title: `Image ${id}`,
            category: id % 2 === 0 ? 'Project Games' : 'Games', // Alternate categories for variety
            description: `Description for image ${id} project Games ames Dwi Bakti N Dev`
        };
    });
    
    // Current weather data
    const weatherData = {
        temp: 24,
        condition: 'Sunny',
        humidity: 65,
        wind: 12,
        pressure: 1012,
        visibility: 10,
        location: 'Jakarta, Indonesia',
        icon: 'fa-sun'
    };
    
    // Weather icons for different conditions
    const weatherIcons = {
        'Sunny': 'fa-sun',
        'Cloudy': 'fa-cloud',
        'Rainy': 'fa-cloud-rain',
        'Thunderstorm': 'fa-bolt',
        'Snowy': 'fa-snowflake',
        'Windy': 'fa-wind',
        'Foggy': 'fa-smog'
    };
    
    // Initialize the gallery
    function initGallery() {
        const galleryContainer = document.getElementById('galleryContainer');
        galleryContainer.innerHTML = '';
        
        imageData.forEach(image => {
            const card = document.createElement('div');
            card.className = 'card card-pin';
            card.innerHTML = `
                <img class="card-img" src="${image.url}" alt="${image.title}" data-id="${image.id}">
                <button class="download-btn" data-url="${image.url}" data-filename="${image.title.replace(/\s+/g, '-').toLowerCase()}.jpg">
                    <i class="fas fa-download"></i>
                </button>
                <div class="overlay">
                    <h2 class="card-title title">${image.title}</h2>
                    <div class="more">
                        <a href="#" class="view-image" data-id="${image.id}">
                            <i class="fas fa-expand me-1"></i> View
                        </a>
                    </div>
                </div>
            `;
            galleryContainer.appendChild(card);
            
            // Add click event to image
            card.querySelector('img').addEventListener('click', function() {
                openImageModal(this.dataset.id);
            });
            
            // Add click event to view button
            card.querySelector('.view-image').addEventListener('click', function(e) {
                e.preventDefault();
                openImageModal(this.dataset.id);
            });
            
            // Add click event to download button
            card.querySelector('.download-btn').addEventListener('click', function(e) {
                e.stopPropagation();
                downloadImage(this.dataset.url, this.dataset.filename);
            });
        });
    }
    
    // Open image modal
    function openImageModal(imageId) {
        const image = imageData.find(img => img.id == imageId);
        if (image) {
            document.getElementById('modalImage').src = image.url;
            document.getElementById('modalTitle').textContent = image.title;
            document.getElementById('modalDescription').textContent = image.description;
            
            // Set download button attributes
            const downloadBtn = document.getElementById('modalDownloadBtn');
            downloadBtn.setAttribute('data-url', image.url);
            downloadBtn.setAttribute('data-filename', `${image.title.replace(/\s+/g, '-').toLowerCase()}.jpg`);
            
            const modal = new bootstrap.Modal(document.getElementById('imageModal'));
            modal.show();
        }
    }
    
    // Download image function
    function downloadImage(url, filename) {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const blobUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(blobUrl);
                document.body.removeChild(a);
                
                // Show download confirmation
                alert(`Image "${filename}" has been downloaded!`);
            })
            .catch(error => {
                console.error('Download error:', error);
                alert('Failed to download image. Please try again.');
            });
    }
    
    // Update weather widget
    function updateWeather(data) {
        document.querySelector('.weather-temp').textContent = `${data.temp}°C`;
        document.querySelector('.weather-icon').className = `fas ${weatherIcons[data.condition] || 'fa-cloud'} weather-icon`;
        document.querySelector('.weather-main div:nth-child(2)').textContent = data.condition;
        document.querySelector('.weather-detail:nth-child(1) span').textContent = `Humidity: ${data.humidity}%`;
        document.querySelector('.weather-detail:nth-child(2) span').textContent = `Wind: ${data.wind} km/h`;
        document.querySelector('.weather-detail:nth-child(3) span').textContent = `Pressure: ${data.pressure} hPa`;
        document.querySelector('.weather-detail:nth-child(4) span').textContent = `Visibility: ${data.visibility} km`;
        document.querySelector('.weather-location span').textContent = data.location;
    }
    
    // Simulate weather data refresh
    function refreshWeather() {
        // Simulate loading
        const tempElement = document.querySelector('.weather-temp');
        tempElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        // Simulate API call delay
        setTimeout(() => {
            // Randomly change weather data for demo
            const conditions = Object.keys(weatherIcons);
            const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
            
            const newWeatherData = {
                temp: Math.floor(Math.random() * 15) + 15, // 15-30°C
                condition: randomCondition,
                humidity: Math.floor(Math.random() * 30) + 50, // 50-80%
                wind: Math.floor(Math.random() * 15) + 5, // 5-20 km/h
                pressure: Math.floor(Math.random() * 20) + 1000, // 1000-1020 hPa
                visibility: Math.floor(Math.random() * 5) + 5, // 5-10 km
                location: weatherData.location,
                icon: weatherIcons[randomCondition]
            };
            
            updateWeather(newWeatherData);
            
            // Show notification
            alert(`Weather data refreshed! Current condition: ${newWeatherData.condition}`);
        }, 1000);
    }
    
    // Search functionality
    document.getElementById('searchInput').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const searchResults = document.getElementById('searchResults');
        
        if (searchTerm.length < 2) {
            searchResults.style.display = 'none';
            return;
        }
        
        const results = imageData.filter(image => 
            image.title.toLowerCase().includes(searchTerm) || 
            image.category.toLowerCase().includes(searchTerm) ||
            image.description.toLowerCase().includes(searchTerm)
        );
        
        if (results.length > 0) {
            searchResults.innerHTML = '';
            results.forEach(image => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.innerHTML = `
                    <div class="d-flex align-items-center">
                        <img src="${image.url}" width="40" height="40" style="object-fit: cover; border-radius: 4px;" class="me-3">
                        <div>
                            <div class="fw-bold">${image.title}</div>
                            <small class="text-muted">${image.category}</small>
                        </div>
                    </div>
                `;
                resultItem.addEventListener('click', function() {
                    openImageModal(image.id);
                    searchResults.style.display = 'none';
                });
                searchResults.appendChild(resultItem);
            });
            searchResults.style.display = 'block';
        } else {
            searchResults.innerHTML = '<div class="search-result-item text-muted">No results found</div>';
            searchResults.style.display = 'block';
        }
    });
    
    // Close search results when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            document.getElementById('searchResults').style.display = 'none';
        }
    });
    
    // Filter by category
    document.querySelectorAll('.category-nav .nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active state
            document.querySelectorAll('.category-nav .nav-link').forEach(el => {
                el.classList.remove('active');
            });
            this.classList.add('active');
            
            const category = this.textContent.toLowerCase();
            filterGallery(category);
        });
    });
    
    // Filter gallery by category
    function filterGallery(category) {
        const galleryContainer = document.getElementById('galleryContainer');
        
        if (category === 'all') {
            initGallery();
            return;
        }
        
        const filteredImages = imageData.filter(image => 
            image.category === category
        );
        
        galleryContainer.innerHTML = '';
        
        if (filteredImages.length === 0) {
            galleryContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <h4 class="text-muted">No images found in this category</h4>
                    <button class="btn btn-primary mt-3" onclick="initGallery()">Show All Images</button>
                </div>
            `;
            return;
        }
        
        filteredImages.forEach(image => {
            const card = document.createElement('div');
            card.className = 'card card-pin';
            card.innerHTML = `
                <img class="card-img" src="${image.url}" alt="${image.title}" data-id="${image.id}">
                <button class="download-btn" data-url="${image.url}" data-filename="${image.title.replace(/\s+/g, '-').toLowerCase()}.jpg">
                    <i class="fas fa-download"></i>
                </button>
                <div class="overlay">
                    <h2 class="card-title title">${image.title}</h2>
                    <div class="more">
                        <a href="#" class="view-image" data-id="${image.id}">
                            <i class="fas fa-expand me-1"></i> View
                        </a>
                    </div>
                </div>
            `;
            galleryContainer.appendChild(card);
            
            // Add click event to image
            card.querySelector('img').addEventListener('click', function() {
                openImageModal(this.dataset.id);
            });
            
            // Add click event to view button
            card.querySelector('.view-image').addEventListener('click', function(e) {
                e.preventDefault();
                openImageModal(this.dataset.id);
            });
            
            // Add click event to download button
            card.querySelector('.download-btn').addEventListener('click', function(e) {
                e.stopPropagation();
                downloadImage(this.dataset.url, this.dataset.filename);
            });
        });
    }
    
    // Weather widget toggle
    document.getElementById('weatherToggle').addEventListener('click', function() {
        const widget = document.getElementById('weatherWidget');
        widget.classList.toggle('hidden');
    });
    
    document.getElementById('weatherClose').addEventListener('click', function() {
        document.getElementById('weatherWidget').classList.add('hidden');
    });
    
    // Refresh weather button
    document.getElementById('refreshWeather').addEventListener('click', refreshWeather);
    
    // Modal download button
    document.getElementById('modalDownloadBtn').addEventListener('click', function() {
        downloadImage(this.dataset.url, this.dataset.filename);
    });
    
    // Initialize the gallery and weather when page loads
    document.addEventListener('DOMContentLoaded', function() {
        initGallery();
        updateWeather(weatherData);
        
        // Hide weather widget initially on mobile
        if (window.innerWidth < 768) {
            document.getElementById('weatherWidget').classList.add('hidden');
        }
    });
