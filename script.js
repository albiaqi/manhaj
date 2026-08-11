
/* =========================================================
   ILMA - MELURUSKAN TANPA MENJATUHKAN
   RESPONSIVE JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     DATA ARTIKEL
  ======================================================= */

  const articles = [

    {
      id: 1,
      category: "Akidah",
      title: "Ni'matul Bidah",
      date: "Artikel 01",

      excerpt:
        "Pembahasan tentang “sebaik-baik bid'ah dan seburuk-buruk bid'ah”, dengan materi Arab dan terjemahan Indonesia.",

      body:
        "Pembahasan ini mengangkat tema bid'ah dan cara memahami hadis-hadis yang berkaitan dengannya. Materi memuat matan kitab mafahim karya syekh alawi al-maliki al-hasani beserta terjemahan.",

      link:
        "ni-matul-bidah.html"
    },

    {
      id: 2,
      category: "Akidah",
      title: "Sibabul Muslim",
      date: "Artikel 02",

      excerpt:
        "Halaman artikel Sibabul Muslim fusuqun wa qitaluhu kufrun.",

      body:
        "Artikel Sibabul Muslim berisi matan dari kitab mafahim.",

      link:
        "sibabul-muslim.html"
    },

    {
      id: 3,
      category: "Akidah",
      title: "Larangan Mengkafirkan",
      date: "Artikel 03",

      excerpt:
        "Pembahasan tentang kehati-hatian dalam persoalan takfir dan pentingnya menyampaikan ilmu dengan penuh tanggung jawab.",

      body:
        "Halaman ini disiapkan untuk materi Larangan Mengkafirkan. Karena pembahasan takfir merupakan perkara yang serius, materi sebaiknya dilengkapi dalil, rujukan ulama, dan verifikasi sebelum dipublikasikan.",

      link:
        "larangan-mengkafirkan.html"
    }

  ];


  /* =======================================================
     ELEMENT
  ======================================================= */

  const body =
    document.body;

  const grid =
    document.getElementById(
      "articleGrid"
    );

  const searchInput =
    document.getElementById(
      "searchInput"
    );

  const categoryFilter =
    document.getElementById(
      "categoryFilter"
    );

  const emptyState =
    document.getElementById(
      "emptyState"
    );

  const modal =
    document.getElementById(
      "articleModal"
    );

  const modalBackdrop =
    document.getElementById(
      "modalBackdrop"
    );

  const closeModalButton =
    document.getElementById(
      "closeModal"
    );

  const menuButton =
    document.getElementById(
      "menuBtn"
    );

  const navigation =
    document.getElementById(
      "nav"
    );

  const themeButton =
    document.getElementById(
      "themeBtn"
    );

  const allArticles =
    document.getElementById(
      "allArticles"
    );

  const articleSection =
    document.getElementById(
      "artikel"
    );

  const progress =
    document.getElementById(
      "progress"
    );

  const year =
    document.getElementById(
      "year"
    );

  const articleCount =
    document.getElementById(
      "articleCount"
    );


  /* =======================================================
     CEK ELEMENT PENTING
  ======================================================= */

  if (!grid) {
    console.warn(
      "articleGrid tidak ditemukan."
    );

    return;
  }


  /* =======================================================
     RENDER ARTIKEL
  ======================================================= */

  function renderArticles() {

    const query =
      searchInput
        ? searchInput.value
            .toLowerCase()
            .trim()
        : "";

    const category =
      categoryFilter
        ? categoryFilter.value
        : "Semua";


    const filtered =
      articles.filter(article => {

        const matchCategory =
          category === "Semua" ||
          article.category === category;


        const searchableText =
          `${article.title}
           ${article.excerpt}
           ${article.category}`
            .toLowerCase();


        const matchSearch =
          searchableText.includes(
            query
          );


        return (
          matchCategory &&
          matchSearch
        );

      });


    if (filtered.length === 0) {

      grid.innerHTML = "";

      if (emptyState) {
        emptyState.style.display =
          "block";
      }

      return;
    }


    if (emptyState) {
      emptyState.style.display =
        "none";
    }


    grid.innerHTML =
      filtered.map(article => `

        <article
          class="article">

          <div
            class="article-tag">

            ${article.category}

          </div>

          <h3>
            ${article.title}
          </h3>

          <p>
            ${article.excerpt}
          </p>

          <div
            class="article-bottom">

            <span
              class="article-date">

              ${article.date}

            </span>

            <button
              class="read"
              type="button"
              data-id="${article.id}">

              Baca artikel →

            </button>

          </div>

        </article>

      `).join("");


    /* Tombol baca */

    grid
      .querySelectorAll(".read")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const id =
              Number(
                button.dataset.id
              );

            openArticle(id);

          }
        );

      });

  }


  /* =======================================================
     OPEN ARTICLE MODAL
  ======================================================= */

  function openArticle(id) {

    const article =
      articles.find(
        item =>
          item.id === id
      );


    if (!article || !modal) {
      return;
    }


    const category =
      document.getElementById(
        "modalCategory"
      );

    const title =
      document.getElementById(
        "modalTitle"
      );

    const meta =
      document.getElementById(
        "modalMeta"
      );

    const modalBody =
      document.getElementById(
        "modalBody"
      );


    if (category) {

      category.innerHTML =
        `<span></span>
         ${article.category}`;

    }


    if (title) {

      title.textContent =
        article.title;

    }


    if (meta) {

      meta.textContent =
        article.date;

    }


    if (modalBody) {

      modalBody.innerHTML = `

        <p>
          ${article.body}
        </p>

        <a
          class="btn primary modal-read"
          href="${article.link}">

          Buka artikel lengkap →

        </a>

      `;

    }


    modal.classList.add(
      "show"
    );

    modal.setAttribute(
      "aria-hidden",
      "false"
    );


    body.style.overflow =
      "hidden";


    document.addEventListener(
      "keydown",
      handleModalKeyboard
    );

  }


  /* =======================================================
     CLOSE MODAL
  ======================================================= */

  function closeArticle() {

    if (!modal) {
      return;
    }


    modal.classList.remove(
      "show"
    );

    modal.setAttribute(
      "aria-hidden",
      "true"
    );


    body.style.overflow =
      "";


    document.removeEventListener(
      "keydown",
      handleModalKeyboard
    );

  }


  /* =======================================================
     MODAL KEYBOARD
  ======================================================= */

  function handleModalKeyboard(event) {

    if (
      event.key === "Escape"
    ) {

      closeArticle();

    }

  }


  /* =======================================================
     SEARCH
  ======================================================= */

  if (searchInput) {

    searchInput.addEventListener(
      "input",
      renderArticles
    );

  }


  /* =======================================================
     CATEGORY FILTER
  ======================================================= */

  if (categoryFilter) {

    categoryFilter.addEventListener(
      "change",
      renderArticles
    );

  }


  /* =======================================================
     CLOSE MODAL
  ======================================================= */

  if (closeModalButton) {

    closeModalButton.addEventListener(
      "click",
      closeArticle
    );

  }


  if (modalBackdrop) {

    modalBackdrop.addEventListener(
      "click",
      closeArticle
    );

  }


  /* =======================================================
     CATEGORY CARD
  ======================================================= */

  document
    .querySelectorAll(
      ".category-card"
    )
    .forEach(card => {

      card.addEventListener(
        "click",
        () => {

          const category =
            card.dataset.category;


          if (categoryFilter) {

            categoryFilter.value =
              category;

          }


          if (articleSection) {

            articleSection.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });

          }


          renderArticles();

        }
      );

    });


  /* =======================================================
     MENU MOBILE
  ======================================================= */

  function openMenu() {

    if (!navigation) {
      return;
    }


    navigation.classList.add(
      "open"
    );

    body.classList.add(
      "menu-open"
    );


    if (menuButton) {

      menuButton.textContent =
        "×";

      menuButton.setAttribute(
        "aria-expanded",
        "true"
      );

    }

  }


  function closeMenu() {

    if (!navigation) {
      return;
    }


    navigation.classList.remove(
      "open"
    );

    body.classList.remove(
      "menu-open"
    );


    if (menuButton) {

      menuButton.textContent =
        "☰";

      menuButton.setAttribute(
        "aria-expanded",
        "false"
      );

    }

  }


  function toggleMenu() {

    if (
      navigation &&
      navigation.classList.contains(
        "open"
      )
    ) {

      closeMenu();

    } else {

      openMenu();

    }

  }


  if (menuButton) {

    menuButton.setAttribute(
      "aria-expanded",
      "false"
    );


    menuButton.addEventListener(
      "click",
      toggleMenu
    );

  }


  /* Tutup menu setelah klik link */

  document
    .querySelectorAll(
      "nav a"
    )
    .forEach(link => {

      link.addEventListener(
        "click",
        closeMenu
      );

    });


  /* Tutup menu ketika resize ke desktop */

  window.addEventListener(
    "resize",
    () => {

      if (
        window.innerWidth > 900
      ) {

        closeMenu();

      }

    }
  );


  /* Tutup menu ketika klik di luar */

  document.addEventListener(
    "click",
    event => {

      if (
        window.innerWidth > 900
      ) {
        return;
      }


      if (
        !navigation ||
        !menuButton
      ) {
        return;
      }


      const clickedInsideNav =
        navigation.contains(
          event.target
        );

      const clickedMenu =
        menuButton.contains(
          event.target
        );


      if (
        navigation.classList.contains(
          "open"
        ) &&
        !clickedInsideNav &&
        !clickedMenu
      ) {

        closeMenu();

      }

    }
  );


  /* =======================================================
     LIHAT SEMUA ARTIKEL
  ======================================================= */

  if (allArticles) {

    allArticles.addEventListener(
      "click",
      event => {

        event.preventDefault();


        if (categoryFilter) {

          categoryFilter.value =
            "Semua";

        }


        if (searchInput) {

          searchInput.value =
            "";

        }


        renderArticles();


        if (articleSection) {

          articleSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }

      }
    );

  }


  /* =======================================================
     DARK MODE
  ======================================================= */

  function setTheme(
    dark
  ) {

    body.classList.toggle(
      "dark",
      dark
    );


    if (themeButton) {

      themeButton.textContent =
        dark ? "☀" : "☾";

      themeButton.setAttribute(
        "aria-label",
        dark
          ? "Gunakan mode terang"
          : "Gunakan mode gelap"
      );

    }


    localStorage.setItem(
      "ilma-theme",
      dark
        ? "dark"
        : "light"
    );

  }


  const savedTheme =
    localStorage.getItem(
      "ilma-theme"
    );


  if (
    savedTheme === "dark"
  ) {

    setTheme(true);

  } else {

    setTheme(false);

  }


  if (themeButton) {

    themeButton.addEventListener(
      "click",
      () => {

        const dark =
          !body.classList.contains(
            "dark"
          );


        setTheme(dark);

      }
    );

  }


  /* =======================================================
     TAHUN OTOMATIS
  ======================================================= */

  if (year) {

    year.textContent =
      new Date()
        .getFullYear();

  }


  /* =======================================================
     JUMLAH ARTIKEL
  ======================================================= */

  if (articleCount) {

    articleCount.textContent =
      String(
        articles.length
      ).padStart(2, "0");

  }


  /* =======================================================
     REVEAL ANIMATION
  ======================================================= */

  if (
    "IntersectionObserver"
      in window
  ) {

    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(
            entry => {

              if (
                entry.isIntersecting
              ) {

                entry.target.classList.add(
                  "visible"
                );

                observer.unobserve(
                  entry.target
                );

              }

            }
          );

        },
        {
          threshold: .12
        }
      );


    document
      .querySelectorAll(
        ".reveal"
      )
      .forEach(element => {

        observer.observe(
          element
        );

      });

  } else {

    document
      .querySelectorAll(
        ".reveal"
      )
      .forEach(element => {

        element.classList.add(
          "visible"
        );

      });

  }


  /* =======================================================
     SCROLL PROGRESS
  ======================================================= */

  function updateProgress() {

    if (!progress) {
      return;
    }


    const documentHeight =
      document.documentElement
        .scrollHeight;


    const viewportHeight =
      window.innerHeight;


    const scrollTop =
      window.scrollY ||
      document.documentElement
        .scrollTop;


    const maxScroll =
      documentHeight -
      viewportHeight;


    const percentage =
      maxScroll > 0
        ? (
            scrollTop /
            maxScroll
          ) * 100
        : 0;


    progress.style.width =
      `${percentage}%`;

  }


  window.addEventListener(
    "scroll",
    updateProgress,
    {
      passive: true
    }
  );


  window.addEventListener(
    "resize",
    updateProgress
  );


  /* =======================================================
     ESCAPE
  ======================================================= */

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape"
      ) {

        closeMenu();
        closeArticle();

      }

    }
  );


  /* =======================================================
     INIT
  ======================================================= */

  renderArticles();

  updateProgress();

});
