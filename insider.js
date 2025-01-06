(async function () {
    const apiUrl =
      "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";
  
    let products = JSON.parse(localStorage.getItem("products"));
    if (!products) {
      try {
        const response = await fetch(apiUrl);
        products = await response.json();
        localStorage.setItem("products", JSON.stringify(products));
      } catch (error) {
        console.error("Error", error);
        return;
      }
    }
  
    const carouselHTML = `
      <div id="you-might-like">
        <div class="recommendation-carousel">
          <div class="carousel-container">
            <p class="combine-products-title">You Might Also Like</p>
            <div class="carousel padded-carousel">
              <button type="button" aria-label="previous" class="carouselBtnBack carousel__back-button carousel-arrow carousel-arrow-left" disabled>
                <svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242">
                  <path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path>
                </svg>
              </button>
              <div>
                <div class="carousel-wrapper">
                  <div class="sliderTray___OneriSistemi"></div>
                </div>
              </div>
              <button type="button" aria-label="next" class="carouselBtnNext carousel__next-button carousel-arrow carousel-arrow-right rotate-180">
                <svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242">
                  <path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    $(".product-detail").after(carouselHTML);
  
    const $carouselSlider = $(".sliderTray___OneriSistemi");
    products.forEach((product) => {
      const isFavorited = localStorage.getItem(`favorite_${product.id}`);
      const productCard = `
        <div class="new-product-card over-write">
          <div class="new-product-card__image-wrapper">
            <a href="${product.url}" target="_blank">
              <img class="product-image" alt="${product.name}" src="${product.img}" />
            </a>
            <div class="new-product-card-like-button" optionid="${product.id}">
              <svg xmlns="http://www.w3.org/2000/svg" width="20.576" height="19.483" viewBox="0 0 20.576 19.483">
                <path
                  fill="none"
                  stroke="${isFavorited ? "blue" : "#555"}"
                  stroke-width="1.5px"
                  d="M19.032 7.111c-.278-3.063-2.446-5.285-5.159-5.285a5.128 5.128 0 0 0-4.394 2.532 4.942 4.942 0 0 0-4.288-2.532C2.478 1.826.31 4.048.032 7.111a5.449 5.449 0 0 0 .162 2.008 8.614 8.614 0 0 0 2.639 4.4l6.642 6.031 6.755-6.027a8.615 8.615 0 0 0 2.639-4.4 5.461 5.461 0 0 0 .163-2.012z"
                  transform="translate(.756 -1.076)"
                ></path>
              </svg>
            </div>
          </div>
          <div class="new-product-card__information-box">
            <div class="new-product-card__information-box__title">
              <a href="${product.url}" target="_blank">
                <p class="product-name">${product.name}</p>
              </a>
            </div>
            <div class="new-product-card__price">
              <div class="price__current-price">${product.price.toFixed(2)} TL</div>
            </div>
          </div>
        </div>
      `;
      $carouselSlider.append(productCard);
    });

    $(".new-product-card-like-button").on("click", function (e) {
        e.stopPropagation();
        const productId = $(this).attr("optionid");
        const $iconPath = $(this).find("path");
        const isFavorited = localStorage.getItem(`favorite_${productId}`);

        if (isFavorited) {
            localStorage.removeItem(`favorite_${productId}`);
            $iconPath.attr("stroke", "#555");
        } else {
            localStorage.setItem(`favorite_${productId}`, "true");
            $iconPath.attr("stroke", "blue");
        }
    });

    const $carouselContainer = $(".carousel-wrapper");
    const $carouselItems = $(".new-product-card");
    const itemWidth = $carouselItems.first().outerWidth(true);
    const visibleWidth = 6.5 * itemWidth; 
    const visibleItems = visibleWidth / itemWidth;

    let currentIndex = 0;
    const totalItems = $carouselItems.length;

    $(".carouselBtnNext").on("click", function () {
      if (currentIndex < totalItems - visibleItems) {
        currentIndex++;
        const translateX = currentIndex * itemWidth;
        $(".sliderTray___OneriSistemi").css("transform", `translateX(-${translateX}px)`);
        updateNavigationButtons();
      }
    });

    $(".carouselBtnBack").on("click", function () {
      if (currentIndex > 0) {
        currentIndex--;
        const translateX = currentIndex * itemWidth;
        $(".sliderTray___OneriSistemi").css("transform", `translateX(-${translateX}px)`);
        updateNavigationButtons();
      }
    });

    function updateNavigationButtons() {
      $(".carouselBtnBack").prop("disabled", currentIndex <= 0);
      $(".carouselBtnNext").prop("disabled", currentIndex >= totalItems - visibleItems);
    }

    $("<style>")
      .text(`
        .carousel-wrapper {
          overflow: hidden;
          width: 100%;
        }
        
        .sliderTray___OneriSistemi {
          display: flex;
          transition: transform 0.3s ease-in-out;
          width: max-content;
          gap: 20px;
        }
      
      `)
      .appendTo("head");
  })();
  