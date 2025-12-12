// =============================================
// SCRIPT PROFISSIONAL - PLURAL CRIATIVO - COMPLETO
// =============================================

document.addEventListener("DOMContentLoaded", function () {
  // =============================================
  // 1. INICIALIZAÇÃO
  // =============================================

  console.log("🔵 Plural Criativo - Site inicializado");

  // =============================================
  // 2. CONFIGURAÇÕES GLOBAIS
  // =============================================

  const config = {
    smoothScrollDuration: 800,
    revealThreshold: 0.1,
    headerTransitionThreshold: 50,
    videoModalTransition: 300,
  };

  // =============================================
  // 3. FUNÇÕES UTILITÁRIAS
  // =============================================

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  const throttle = (func, limit) => {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  };

  // =============================================
  // 4. BOTÃO VOLTAR AO TOPO (ADICIONADO AQUI)
  // =============================================

  function initBackToTop() {
    console.log("🔼 Inicializando botão Voltar ao Topo");

    const backToTopButton = document.getElementById("backToTop");

    if (!backToTopButton) {
      console.error(
        '❌ Botão "Voltar ao Topo" não encontrado! Criando manualmente...'
      );

      // Criar botão manualmente se não existir
      const button = document.createElement("button");
      button.id = "backToTop";
      button.className = "back-to-top";
      button.setAttribute("aria-label", "Voltar ao topo da página");
      button.setAttribute("title", "Voltar ao topo");
      button.innerHTML = '<i class="fas fa-chevron-up"></i>';
      document.body.appendChild(button);

      // Atualizar referência
      window.backToTopButton = button;
    } else {
      window.backToTopButton = backToTopButton;
      console.log('✅ Botão "Voltar ao Topo" encontrado');
    }

    // Elementos de referência
    const clientsSection = document.querySelector(".clients-section");
    const heroSection = document.querySelector(".hero");

    console.log(
      "📍 Seção de clientes:",
      clientsSection ? "Encontrada" : "Não encontrada"
    );
    console.log(
      "📍 Seção hero:",
      heroSection ? "Encontrada" : "Não encontrada"
    );

    // Função para verificar se deve mostrar o botão
    function checkScrollPosition() {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      console.log(
        "📏 Scroll position:",
        scrollY,
        "Window height:",
        windowHeight
      );

      // Mostrar botão quando passar 50px da seção de clientes
      let shouldShow = false;

      if (clientsSection) {
        const clientsRect = clientsSection.getBoundingClientRect();
        const clientsBottom = clientsRect.bottom + scrollY;

        console.log("📊 Clients bottom:", clientsBottom);
        console.log("📊 Clients visible:", clientsRect.bottom > 0);

        // Se a seção de clientes já saiu da tela (bottom < 0) OU se scrollou mais de 500px
        if (clientsRect.bottom < -50 || scrollY > 500) {
          shouldShow = true;
          console.log("👁️ Mostrar botão: Passou da seção de clientes");
        }
      } else {
        // Fallback: mostrar após 500px de scroll
        shouldShow = scrollY > 500;
        console.log(
          "👁️ Mostrar botão (fallback):",
          shouldShow,
          "Scroll:",
          scrollY
        );
      }

      // Esconder no topo da página
      if (scrollY < 100) {
        shouldShow = false;
        console.log("🙈 Esconder botão: No topo da página");
      }

      // Aplicar classe visible
      if (shouldShow) {
        window.backToTopButton.classList.add("visible");
      } else {
        window.backToTopButton.classList.remove("visible");
      }
    }

    // Função para rolar suavemente ao topo
    function scrollToTop() {
      console.log("🚀 Rolando para o topo...");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      // Focar no header para acessibilidade
      setTimeout(() => {
        const header = document.getElementById("mainHeader");
        if (header) {
          header.focus();
        }
      }, 500);
    }

    // Adicionar event listeners
    window.backToTopButton.addEventListener("click", scrollToTop);

    // Permitir tecla Enter para acessibilidade
    window.backToTopButton.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        scrollToTop();
      }
    });

    // Verificar posição inicial após carregamento
    setTimeout(() => {
      checkScrollPosition();
      console.log("🔍 Verificação inicial concluída");
    }, 500);

    // Verificar posição ao rolar (com throttle para performance)
    window.addEventListener("scroll", throttle(checkScrollPosition, 100));

    // Atualizar ao redimensionar
    window.addEventListener("resize", checkScrollPosition);

    // Forçar verificação adicional após 2 segundos
    setTimeout(checkScrollPosition, 2000);

    console.log('✅ Botão "Voltar ao Topo" inicializado com sucesso');
  }

  // =============================================
  // 5. HEADER INTERATIVO
  // =============================================

  const header = document.getElementById("mainHeader");
  const heroSection = document.querySelector(".hero");

  function updateHeader() {
    const scrollY = window.scrollY;
    const heroHeight = heroSection ? heroSection.offsetHeight : 0;

    if (scrollY > config.headerTransitionThreshold) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Atualizar navegação ativa
    updateActiveNav();
  }

  // =============================================
  // 6. NAVEGAÇÃO SMOOTH SCROLL
  // =============================================

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (href === "#" || href === "#top") {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        e.preventDefault();
        return;
      }

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const headerHeight = header.offsetHeight;
      const targetPosition =
        target.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = targetPosition - headerHeight - 20;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Fechar menu mobile se aberto
      closeMobileMenu();
    });
  });

  // =============================================
  // 7. MENU MOBILE
  // =============================================

  // VERSÃO SIMPLIFICADA
  const navToggle = document.getElementById("navToggleSticky");
  const navList = document.getElementById("navListSticky");

  function toggleMobileMenu() {
    const isOpen = navList.classList.toggle("active");
    navToggle.setAttribute("aria-expanded", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  function closeMobileMenu() {
    navList.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  if (navToggle && navList) {
    navToggle.addEventListener("click", toggleMobileMenu);

    // Fechar ao clicar nos links
    navList.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });

    // Fechar ao clicar fora (somente mobile)
    document.addEventListener("click", (e) => {
      if (
        window.innerWidth <= 768 &&
        !navToggle.contains(e.target) &&
        !navList.contains(e.target) &&
        navList.classList.contains("active")
      ) {
        closeMobileMenu();
      }
    });
  }
  // =============================================
  // 8. SCROLL REVEAL - SIMPLIFICADO
  // =============================================
  function initScrollReveal() {
    const revealElements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  // =============================================
  // 9. PORTFOLIO INTERATIVO
  // =============================================

  function initPortfolio() {
    const portfolioItems = document.querySelectorAll(".portfolio-item");

    portfolioItems.forEach((item) => {
      // Remove efeito de tilt 3D que pode causar problemas
      item.addEventListener("mouseenter", () => {
        item.style.transform = "translateY(-12px)";
      });

      item.addEventListener("mouseleave", () => {
        item.style.transform = "translateY(0)";
      });

      // Abrir modal ao clicar
      item.addEventListener("click", () => {
        const videoSrc = item.dataset.video;
        if (videoSrc) {
          openVideoModal(videoSrc);
        }
      });

      // Permitir tecla Enter para acessibilidade
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const videoSrc = item.dataset.video;
          if (videoSrc) {
            openVideoModal(videoSrc);
          }
        }
      });
    });
  }

  // =============================================
  // 10. MODAL DE VÍDEO
  // =============================================

  const modal = document.getElementById("modal");
  const modalVideo = document.getElementById("modalVideo");
  const modalClose = document.getElementById("modalClose");
  const modalBackdrop = document.getElementById("modalBackdrop");

  function openVideoModal(src) {
    if (!modal || !modalVideo) return;

    modalVideo.src = src;
    modalVideo.load();

    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // Tenta reproduzir automaticamente
    const playPromise = modalVideo.play();

    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.log(
          "Reprodução automática bloqueada, aguardando clique do usuário"
        );
      });
    }
  }

  function closeVideoModal() {
    if (!modal || !modalVideo) return;

    modal.setAttribute("aria-hidden", "true");
    modalVideo.pause();
    modalVideo.currentTime = 0;
    modalVideo.src = "";
    document.body.style.overflow = "";
  }

  if (modalClose) {
    modalClose.addEventListener("click", closeVideoModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", closeVideoModal);
  }

  // Fechar com ESC
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      modal &&
      modal.getAttribute("aria-hidden") === "false"
    ) {
      closeVideoModal();
    }
  });

  // =============================================
  // 11. FORMULÁRIO DE CONTATO (ATUALIZADO PARA ENVIO VIA PHP/AJAX)
  // =============================================

  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    // Remove autocomplete dos campos
    const inputs = contactForm.querySelectorAll("input, textarea, select");
    inputs.forEach((input) => {
      input.setAttribute("autocomplete", "off");
      input.setAttribute("autocorrect", "off");
      input.setAttribute("autocapitalize", "off");
      input.setAttribute("spellcheck", "false");
    });

    // Validação em tempo real
    inputs.forEach((input) => {
      input.addEventListener("blur", () => validateField(input));
      input.addEventListener("input", () => clearError(input));
    });

    function validateField(field) {
      const value = field.value.trim();
      const fieldName = field.getAttribute("name");

      if (field.hasAttribute("required") && !value) {
        showError(field, "Este campo é obrigatório");
        return false;
      }

      if (fieldName === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          showError(field, "Por favor, insira um email válido");
          return false;
        }
      }

      return true;
    }

    function showError(field, message) {
      clearError(field);

      const errorDiv = document.createElement("div");
      errorDiv.className = "error-message";
      errorDiv.textContent = message;
      errorDiv.style.color = "#ef4444";
      errorDiv.style.fontSize = "0.875rem";
      errorDiv.style.marginTop = "0.25rem";

      field.parentNode.appendChild(errorDiv);
      field.style.borderColor = "#ef4444";
    }

    function clearError(field) {
      const errorDiv = field.parentNode.querySelector(".error-message");
      if (errorDiv) {
        errorDiv.remove();
      }
      field.style.borderColor = "";
    }

    // Envio do formulário (LÓGICA ATUALIZADA PARA ENVIO VIA PHP/AJAX)
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      let isValid = true;
      inputs.forEach((input) => {
        if (!validateField(input)) {
          isValid = false;
        }
      });

      if (!isValid) {
        showNotification("Por favor, corrija os erros no formulário.", "error");
        return;
      }

      const submitButton = contactForm.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      showNotification("Enviando mensagem automaticamente...", "loading");

      // Coletar dados do formulário
      const formData = new FormData(contactForm);

      try {
        // Envio da requisição POST para o script de servidor (send_email.php)
        const response = await fetch("send_email.php", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (response.ok && result.success) {
          console.log("SUCESSO:", result.message);
          showNotification(
            "Mensagem enviada com sucesso! Você receberá o e-mail em instantes.",
            "success"
          );
          contactForm.reset();
        } else {
          console.error("FALHA:", result.message);
          showNotification(`Falha no envio: ${result.message}`, "error");
        }
      } catch (error) {
        console.error("Erro de rede/servidor:", error);
        showNotification(
          "Ocorreu um erro de rede. Verifique se o arquivo send_email.php existe no servidor.",
          "error"
        );
      } finally {
        submitButton.disabled = false;
      }
    });
  }

  // =============================================
  // 12. NOTIFICAÇÕES
  // =============================================

  function showNotification(message, type = "info") {
    // Remover notificação existente
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) {
      existingNotification.remove();
    }

    // Criar nova notificação
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span>${message}</span>
        <button class="notification-close" aria-label="Fechar">&times;</button>
      </div>
    `;

    // Estilos inline para garantir funcionamento
    Object.assign(notification.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      background:
        type === "error"
          ? "#ef4444"
          : type === "success"
          ? "#10b981"
          : type === "loading"
          ? "#3b82f6"
          : "#1e293b",
      color: "white",
      padding: "1rem 1.5rem",
      borderRadius: "12px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
      zIndex: "9999",
      animation: "slideIn 0.3s ease",
      maxWidth: "400px",
      fontFamily: "'Poppins', sans-serif",
    });

    const content = notification.querySelector(".notification-content");
    Object.assign(content.style, {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "1rem",
    });

    const closeBtn = notification.querySelector(".notification-close");
    Object.assign(closeBtn.style, {
      background: "none",
      border: "none",
      color: "white",
      fontSize: "1.5rem",
      cursor: "pointer",
      padding: "0",
      lineHeight: "1",
    });

    closeBtn.addEventListener("click", () => {
      notification.remove();
    });

    document.body.appendChild(notification);

    // Remover automaticamente após 5 segundos (exceto loading)
    if (type !== "loading") {
      setTimeout(() => {
        if (notification.parentNode) {
          notification.style.animation = "slideOut 0.3s ease";
          setTimeout(() => notification.remove(), 300);
        }
      }, 5000);
    }
  }

  // =============================================
  // 13. ANIMAÇÃO DO MARQUEE
  // =============================================

  function initMarquee() {
    const marqueeTracks = document.querySelectorAll(".marquee-track");

    marqueeTracks.forEach((track) => {
      // Duplicar conteúdo para loop contínuo
      const content = track.innerHTML;
      track.innerHTML += content;
    });
  }

  // =============================================
  // 14. LAZY LOADING DE IMAGENS
  // =============================================

  function initLazyLoading() {
    const lazyImages = document.querySelectorAll("img[data-src]");

    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.removeAttribute("data-src");
              imageObserver.unobserve(img);
            }
          });
        },
        {
          rootMargin: "50px 0px",
          threshold: 0.1,
        }
      );

      lazyImages.forEach((img) => imageObserver.observe(img));
    } else {
      // Fallback para navegadores antigos
      lazyImages.forEach((img) => {
        img.src = img.dataset.src;
      });
    }
  }

  // =============================================
  // 15. NAVEGAÇÃO ATIVA
  // =============================================

  function updateActiveNav() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-list a[href^='#']");

    let current = "";
    const scrollPos = window.scrollY + 150;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      const href = link.getAttribute("href");
      if (href === `#${current}` || (current === "" && href === "#top")) {
        link.classList.add("active");
      }
    });
  }

  // =============================================
  // 16. INICIALIZAÇÃO COMPLETA
  // =============================================

  function init() {
    console.log("🚀 Iniciando aplicação...");

    // Elementos básicos
    const yearSpan = document.getElementById("year");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // Inicializar componentes
    updateHeader();
    initScrollReveal();
    initPortfolio();
    initMarquee();
    initLazyLoading();
    updateActiveNav();

    // INICIALIZAR BOTÃO VOLTAR AO TOPO (CRÍTICO)
    initBackToTop();

    // Garantir que tudo esteja visível
    document.querySelectorAll("section").forEach((section) => {
      section.style.opacity = "1";
      section.style.visibility = "visible";
    });

    // Remover skeletons após carregamento
    document.querySelectorAll(".skeleton").forEach((el) => {
      el.classList.remove("skeleton");
    });

    console.log("✅ Aplicação inicializada com sucesso!");
  }

  // =============================================
  // 17. EVENT LISTENERS GLOBAIS
  // =============================================

  // Scroll otimizado
  window.addEventListener("scroll", throttle(updateHeader, 100));
  window.addEventListener("scroll", debounce(updateActiveNav, 50));

  // Resize handler
  window.addEventListener(
    "resize",
    debounce(() => {
      updateHeader();
      if (window.innerWidth > 768) {
        closeMobileMenu();
      }
    }, 250)
  );

  // Load handler
  window.addEventListener("load", () => {
    // Garantir que o vídeo do hero esteja visível
    const heroVideo = document.querySelector(".hero-video");
    if (heroVideo) {
      heroVideo.style.opacity = "1";
    }

    // Adicionar classe loaded para possíveis animações
    setTimeout(() => {
      document.body.classList.add("loaded");
    }, 300);
  });

  // =============================================
  // 18. INICIALIZAR TUDO
  // =============================================

  init();

  // =============================================
  // 19. DEPURAÇÃO E TESTES (REMOVER EM PRODUÇÃO)
  // =============================================

  setTimeout(() => {
    console.log("=== DEBUG INFO ===");

    // Verificar botão
    const backToTopBtn = document.getElementById("backToTop");
    console.log("Botão encontrado no DOM:", !!backToTopBtn);

    if (backToTopBtn) {
      console.log("Botão classes:", backToTopBtn.className);
      console.log(
        "Botão estilos:",
        window.getComputedStyle(backToTopBtn).display
      );

      // Testar visibilidade forçada
      backToTopBtn.style.opacity = "1";
      backToTopBtn.style.visibility = "visible";
      backToTopBtn.style.transform = "translateY(0)";
      backToTopBtn.style.display = "flex";

      console.log("✅ Botão deve estar visível agora");
    }

    // Verificar seções
    const clientsSection = document.querySelector(".clients-section");
    console.log(
      "Seção clients:",
      clientsSection ? "Encontrada" : "Não encontrada"
    );

    if (clientsSection) {
      const rect = clientsSection.getBoundingClientRect();
      console.log("Posição clients:", {
        top: rect.top,
        bottom: rect.bottom,
        scrollY: window.scrollY,
      });
    }
  }, 3000);

  // =============================================
  // 20. EXPORTAR FUNÇÕES PARA DEBUG
  // =============================================

  window.PluralCriativo = {
    openVideoModal,
    closeVideoModal,
    showNotification,
    updateHeader,
    updateActiveNav,
    checkScrollPosition: window.backToTop?.checkScrollPosition,
    scrollToTop: window.backToTop?.scrollToTop,
    forceShowBackToTop: () => {
      const btn = document.getElementById("backToTop");
      if (btn) {
        btn.classList.add("visible");
        btn.style.opacity = "1";
        btn.style.visibility = "visible";
        btn.style.transform = "translateY(0)";
        console.log("✅ Botão forçado a aparecer");
      }
    },
  };

  console.log("🎉 Script carregado completamente!");
});
// Controle de animação e estado final
document.addEventListener("DOMContentLoaded", function () {
  const title = document.querySelector(".hero-title.fill-premium");

  if (title) {
    // Quando a animação terminar
    title.addEventListener("animationend", function () {
      this.classList.add("animation-complete");

      // Garantir que o gradiente fique visível permanentemente
      const beforeElement = this;
      beforeElement.style.animation = "none";
      beforeElement.style.opacity = "1";
      beforeElement.style.filter = "blur(0)";

      console.log("✅ Animação de preenchimento concluída!");
    });

    // Fallback: após 6 segundos, forçar estado final
    setTimeout(() => {
      if (!title.classList.contains("animation-complete")) {
        title.classList.add("animation-complete");
        console.log("🔄 Fallback: animação forçada para estado final");
      }
    }, 6000);
  }
});
