document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;

    /* =========================================
       READING PROGRESS BAR
    ========================================= */

    const progress = document.createElement("div");

    progress.id = "reading-progress";

    document.body.prepend(progress);


    /* =========================================
       READING TOOLS
    ========================================= */

    const tools = document.createElement("div");

    tools.className = "reading-tools";

    tools.innerHTML = `
        <button id="font-minus" title="Perkecil teks">
            A−
        </button>

        <button id="font-plus" title="Perbesar teks">
            A+
        </button>

        <button id="focus-mode" title="Mode fokus">
            ◉
        </button>

        <button id="dark-mode" title="Mode gelap">
            ☾
        </button>

        <button id="top-btn" title="Kembali ke atas">
            ↑
        </button>
    `;

    document.body.appendChild(tools);


    /* =========================================
       ELEMENT ARTIKEL
    ========================================= */

    const arabicTexts = [
        ...document.querySelectorAll(".arabic-text")
    ];

    const paragraphs = [
        ...document.querySelectorAll("main p")
    ];


    /* =========================================
       LOCAL STORAGE
    ========================================= */

    let fontSize =
        Number(
            localStorage.getItem("indexFontSize")
        ) || 21;


    const savedDark =
        localStorage.getItem("indexDark") === "true";


    if (savedDark) {
        body.classList.add("dark-mode");
    }


    /* =========================================
       FONT SIZE
    ========================================= */

    function applyFontSize() {

        arabicTexts.forEach((element) => {

            element.style.fontSize =
                `${fontSize}px`;

        });


        localStorage.setItem(
            "indexFontSize",
            fontSize
        );
    }


    /* =========================================
       READING PROGRESS
    ========================================= */

    function updateProgress() {

        const scrollTop =
            window.scrollY;


        const documentHeight =
            document.documentElement.scrollHeight;


        const windowHeight =
            window.innerHeight;


        const maxScroll =
            documentHeight - windowHeight;


        if (maxScroll <= 0) {

            progress.style.width = "0%";

            return;
        }


        const percentage =
            (scrollTop / maxScroll) * 100;


        progress.style.width =
            `${percentage}%`;
    }


    /* =========================================
       FOCUS MODE
    ========================================= */

    function highlightReadingParagraph() {

        if (
            !body.classList.contains(
                "focus-mode"
            )
        ) {
            return;
        }


        const target =
            window.innerHeight * 0.35;


        let closest = null;

        let distance = Infinity;


        paragraphs.forEach((paragraph) => {

            const rect =
                paragraph.getBoundingClientRect();


            const center =
                rect.top +
                rect.height / 2;


            const currentDistance =
                Math.abs(
                    center - target
                );


            if (
                currentDistance <
                distance
            ) {

                distance =
                    currentDistance;

                closest =
                    paragraph;
            }

        });


        paragraphs.forEach((paragraph) => {

            paragraph.classList.remove(
                "reading-now"
            );

        });


        if (closest) {

            closest.classList.add(
                "reading-now"
            );
        }
    }


    /* =========================================
       A+ FONT BESAR
    ========================================= */

    const fontPlus =
        document.getElementById(
            "font-plus"
        );


    if (fontPlus) {

        fontPlus.addEventListener(
            "click",
            () => {

                fontSize += 2;


                if (fontSize > 36) {

                    fontSize = 36;
                }


                applyFontSize();
            }
        );
    }


    /* =========================================
       A- FONT KECIL
    ========================================= */

    const fontMinus =
        document.getElementById(
            "font-minus"
        );


    if (fontMinus) {

        fontMinus.addEventListener(
            "click",
            () => {

                fontSize -= 2;


                if (fontSize < 15) {

                    fontSize = 15;
                }


                applyFontSize();
            }
        );
    }


    /* =========================================
       DARK MODE
    ========================================= */

    const darkMode =
        document.getElementById(
            "dark-mode"
        );


    if (darkMode) {

        darkMode.addEventListener(
            "click",
            () => {

                body.classList.toggle(
                    "dark-mode"
                );


                localStorage.setItem(
                    "indexDark",
                    body.classList.contains(
                        "dark-mode"
                    )
                );
            }
        );
    }


    /* =========================================
       FOCUS MODE
    ========================================= */

    const focusMode =
        document.getElementById(
            "focus-mode"
        );


    if (focusMode) {

        focusMode.addEventListener(
            "click",
            () => {

                body.classList.toggle(
                    "focus-mode"
                );


                highlightReadingParagraph();
            }
        );
    }


    /* =========================================
       KEMBALI KE ATAS
    ========================================= */

    const topButton =
        document.getElementById(
            "top-btn"
        );


    if (topButton) {

        topButton.addEventListener(
            "click",
            () => {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );
    }


    /* =========================================
       KLIK PARAGRAF SAAT FOCUS MODE
    ========================================= */

    paragraphs.forEach((paragraph) => {

        paragraph.addEventListener(
            "click",
            () => {

                if (
                    !body.classList.contains(
                        "focus-mode"
                    )
                ) {
                    return;
                }


                paragraphs.forEach(
                    (item) => {

                        item.classList.remove(
                            "reading-now"
                        );

                    }
                );


                paragraph.classList.add(
                    "reading-now"
                );

            }
        );

    });


    /* =========================================
       DOUBLE CLICK COPY TEKS ARAB
    ========================================= */

    arabicTexts.forEach((text) => {

        text.title =
            "Double-click untuk menyalin teks Arab";


        text.addEventListener(
            "dblclick",
            async () => {

                try {

                    await navigator.clipboard.writeText(
                        text.innerText
                    );


                    const oldTitle =
                        text.title;


                    text.title =
                        "Teks Arab berhasil disalin ✓";


                    setTimeout(
                        () => {

                            text.title =
                                oldTitle;

                        },
                        1600
                    );


                } catch (error) {

                    alert(
                        "Browser tidak mengizinkan penyalinan otomatis."
                    );

                }

            }
        );

    });


    /* =========================================
       KEYBOARD SHORTCUT
    ========================================= */

    document.addEventListener(
        "keydown",
        (event) => {

            /*
             * Jangan jalankan shortcut
             * ketika sedang mengetik.
             */

            if (
                event.target.matches(
                    "input, textarea"
                )
            ) {
                return;
            }


            /* ===============================
               A+ / =
            =============================== */

            if (
                event.key === "+" ||
                event.key === "="
            ) {

                fontSize += 2;


                if (fontSize > 36) {

                    fontSize = 36;
                }


                applyFontSize();
            }


            /* ===============================
               A-
            =============================== */

            if (
                event.key === "-"
            ) {

                fontSize -= 2;


                if (fontSize < 15) {

                    fontSize = 15;
                }


                applyFontSize();
            }


            /* ===============================
               D = DARK MODE
            =============================== */

            if (
                event.key.toLowerCase() === "d"
            ) {

                body.classList.toggle(
                    "dark-mode"
                );


                localStorage.setItem(
                    "indexDark",
                    body.classList.contains(
                        "dark-mode"
                    )
                );
            }


            /* ===============================
               F = FOCUS MODE
            =============================== */

            if (
                event.key.toLowerCase() === "f"
            ) {

                body.classList.toggle(
                    "focus-mode"
                );


                highlightReadingParagraph();
            }


            /* ===============================
               HOME
            =============================== */

            if (
                event.key === "Home"
            ) {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }

        }
    );


    /* =========================================
       SCROLL EVENT
    ========================================= */

    window.addEventListener(
        "scroll",
        () => {

            updateProgress();

            highlightReadingParagraph();

        },
        {
            passive: true
        }
    );


    /* =========================================
       INITIALIZE
    ========================================= */

    applyFontSize();

    updateProgress();

});