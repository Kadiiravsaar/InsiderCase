(() => {
    const prefix = "case-"

    const init = () => {
        buildHTML();
        buildCSS();
        requestProducts();
    };

    const requestProducts = () => {
        const url = 'https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json';

        $.getJSON(url, (data) => {
            if (data && data.length > 0) {
                displayProducts(data);

            } else {
                $(`.${prefix}content`).html('<p>Ürün bulunamadı!</p>');
            }
        }).fail((textStatus, error) => {
            $(`.${prefix}content`).html(`<p>Ürünler yüklenirken bir hata oluştu! Hata: ${textStatus} - ${error}</p>`);
        });
    };

    const displayProducts = (products) => {
        let favorites = getFavorites();

        let productHTML = '';
        products.forEach((product) => {
            const isFavorite = favorites.includes(product.id.toString());
            productHTML += `
                <div class="${prefix}carousel-item">
                  
                        <div class="${prefix}heart-icon ${isFavorite ? ` ${prefix}active` : ''}" data-id="${product.id}">&#x2764;</div>
                        <img src="${product.img}" alt="${product.name}" />
                        <h2>${product.name}</h2>
                        <p>Fiyat: ${product.price.toFixed(2)} TL</p>
                        <a href="${product.url}" target="_blank">Detaylı İncele</a>
                </div>
            `;
        });

        const test = `
            <div class="${prefix}carousel-items">${productHTML}</div>
        `;
        $(`.${prefix}content`).append(test);
        FavoriteButtonListeners();
        setupCarousel();
    };

    const FavoriteButtonListeners = () => {
        $(`.${prefix}heart-icon`).off('click').on('click', function () {
            const productId = $(this).data('id').toString();

            if ($(this).hasClass(`${prefix}active`)) {
                $(this).removeClass(`${prefix}active`);
                removeFavorite(productId);
            } else {
                $(this).addClass(`${prefix}active`);
                addFavorite(productId);
            }
        });
    };

    const getFavorites = () => {
        const favorites = localStorage.getItem('favorites');
        return favorites ? JSON.parse(favorites) : [];
    };

    const addFavorite = (productId) => {
        const favorites = getFavorites();
        if (!favorites.includes(productId)) {
            favorites.push(productId);
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }
    };

    const removeFavorite = (productId) => {
        let favorites = getFavorites();
        favorites = favorites.filter((id) => id !== productId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    };



    const setupCarousel = () => {
        let scrollAmount = 0;
        const carousel = document.querySelector(`.${prefix}content`);
        const leftButton = document.querySelector(`.${prefix}left-icon`);
        const rightButton = document.querySelector(`.${prefix}right-icon`);

        const isMobile = window.innerWidth <= 768;
        const itemWidth = isMobile ? carousel.querySelector(`.${prefix}carousel-item`).offsetWidth : 300;
        const scrollWidth = carousel.scrollWidth - carousel.clientWidth;

        leftButton.addEventListener('click', () => {
            scrollAmount -= itemWidth;
            if (scrollAmount < 0) scrollAmount = 0;
            carousel.scrollTo({ left: scrollAmount, behavior: 'smooth' });
        });

        rightButton.addEventListener('click', () => {
            scrollAmount += itemWidth;
            if (scrollAmount > scrollWidth) scrollAmount = scrollWidth;
            carousel.scrollTo({ left: scrollAmount, behavior: 'smooth' });
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                scrollAmount -= itemWidth;
                if (scrollAmount < 0) scrollAmount = 0;
                carousel.scrollTo({ left: scrollAmount, behavior: 'smooth' });
            } else if (event.key === 'ArrowRight') {
                scrollAmount += itemWidth;
                if (scrollAmount > scrollWidth) scrollAmount = scrollWidth;
                carousel.scrollTo({ left: scrollAmount, behavior: 'smooth' });
            }
        });
    };


    const buildHTML = () => {
        const container = `
                <div class="${prefix}container">
                    <button class="${prefix}left-icon"><</button>
                    <div class="${prefix}content">
                        <h3 class="${prefix}section-title">Bunları da Sevebilirsiniz</h3>
                    </div>
                    <button class="${prefix}right-icon">></button>
                </div>
            `;

        $(`.product-detail`).after(container)

    };

    const buildCSS = () => {
        const css = `
        .${prefix}container {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            width: 100%;
            overflow: hidden;
        }
       
        .${prefix}content {
            display: flex;
            flex-direction: column;
            gap: 20px;
            width: 90%;
            padding: 10px 0;
            scroll-snap-type: x mandatory; 
            overflow-x: auto; 
            scrollbar-width: none; 
        }
        
        .${prefix}content::-webkit-scrollbar {
            display: none; 
        }

        .${prefix}carousel-items {
            display: flex;
            gap: 20px;
        }
        
        .${prefix}carousel-item {
            flex: 0 0 auto;
            width: 14.5%; 
            border: 1px solid #ccc;
            border-radius: 8px 8px 28px 28px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            text-align: center;
            position: relative;
            scroll-snap-align: start; 
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .${prefix}highlight {
            background-color: yellow;
            color: black;
        }
        .${prefix}section-title{
            align-self: flex-start;
            font-size: 30px;
            margin-bottom: 10px;
            margin-top: 20px;
        }
        
        .${prefix}carousel-item img {
            max-width: 100%;
            height: auto;
            margin-bottom: 10px;
        }
        .${prefix}carousel-item h2 {
            font-size: 1.2em;
            margin: 10px 0;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 2;
            height: 2.25em;
        }
        .${prefix}carousel-item p {
            font-size: 1em;
            color: #333;
        }
        
        .${prefix}carousel-item a {
            width: 80%;
            display: inline-block;
            margin-top: 10px;
            padding: 5px 10px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .${prefix}carousel-item a:hover {
            background-color: #0056b3;
        }

        .${prefix}heart-icon {
            cursor: pointer;
            position: absolute;
            top: 9px;
            right: 15px;
            width: 34px;
            height: 34px;
            background-color:  #fff;
            border-radius: 5px;
            box-shadow: 0 3px 6px 0 rgba(0, 0, 0, .16);
            border: solid .5px #b6b7b9;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .${prefix}active {
            color: blue;
        }
        
        .${prefix}left-icon,
        .${prefix}right-icon {
            background-color: #007bff;
            color: white;
            border: none;
            font-size: 40px;
            cursor: pointer;
            padding: 10px;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 10;
            color:black;
            background:none;
        }
        
        .${prefix}left-icon {
            left: 15px;
        }
        
        .${prefix}right-icon {
            right: 15px;
        }
        
        @media (max-width: 1024px) {
            .${prefix}content {
                flex-wrap: nowrap;
            }
            .${prefix}left-icon {
                left: 0px;
            }
            
            .${prefix}right-icon {
                right: 0px;
            }
            .${prefix}carousel-item {
                width: 250px; 
            }
        }
        
        @media (max-width: 768px) {
            .${prefix}container {
                flex-direction: column;
            }
            .${prefix}content {
                flex-wrap: nowrap;
            }
            .${prefix}carousel-item {
                width: 100%; 
            }
            .${prefix}left-icon,
            .${prefix}right-icon {
                display: none;
            }
        }
        
        `;
        $('<style>').addClass(`${prefix}style`).html(css).appendTo('head');
    };

    init();
})();
