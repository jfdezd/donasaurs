export type Locale = "es" | "en";

export interface Translations {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    brand: string;
    explore: string;
    listItem: string;
    myOrders: string;
    signIn: string;
    signOut: string;
    loading: string;
  };
  hero: {
    claim: string;
    subclaim: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  howItWorks: {
    title: string;
    subtitle: string;
    steps: Array<{
      number: string;
      title: string;
      description: string;
    }>;
    note: string;
  };
  whyDifferent: {
    title: string;
    points: Array<{
      title: string;
      description: string;
    }>;
  };
  community: {
    title: string;
    subtitle: string;
    traits: string[];
  };
  manifesto: {
    line1: string;
    line2: string;
  };
  finalCta: {
    headline: string;
    button: string;
  };
}

export const translations: Record<Locale, Translations> = {
  es: {
    meta: {
      title: "Donasaurio - La forma en que todos podemos ayudar",
      description:
        "Regala lo que ya no usas y convierte objetos en donaciones reales.",
    },
    nav: {
      brand: "Donasaurio",
      explore: "Explorar",
      listItem: "Publicar",
      myOrders: "Mis pedidos",
      signIn: "Entrar",
      signOut: "Salir",
      loading: "Cargando...",
    },
    hero: {
      claim: "La forma en que todos podemos ayudar.",
      subclaim:
        "Regala lo que ya no usas y convierte objetos en donaciones reales.",
      ctaPrimary: "Publica un objeto",
      ctaSecondary: "Explora objetos",
    },
    howItWorks: {
      title: "Así de fácil",
      subtitle: "Tres pasos. Cero complicaciones.",
      steps: [
        {
          number: "1",
          title: "Publica algo que ya no uses",
          description:
            "Sube una foto, ponle título y listo. Tu objeto empieza su nueva vida.",
        },
        {
          number: "2",
          title: "Alguien dona a una ONG",
          description:
            "Otra persona elige tu objeto y hace una donación directa a una organización social.",
        },
        {
          number: "3",
          title: "Entrega el objeto y genera impacto",
          description:
            "Coordinas la entrega, y tu objeto se convierte en ayuda real.",
        },
      ],
      note: "La donación va directamente a la ONG. Donasaurio no toca el dinero.",
    },
    whyDifferent: {
      title: "Por qué Donasaurio es diferente",
      points: [
        {
          title: "No todo tiene que venderse",
          description:
            "Hay cosas que valen más cuando se dan. Aquí, tus objetos tienen un propósito más grande.",
        },
        {
          title: "No todo tiene que tirarse",
          description:
            "Antes de descartar, piensa en quién lo necesita. Dale una segunda vida a lo que ya no usas.",
        },
        {
          title: "Ayuda sin gastar dinero",
          description:
            "No necesitas abrir la cartera. Solo hace falta abrir un cajón.",
        },
        {
          title: "Segunda vida, impacto real",
          description:
            "Cada objeto que regalas se convierte en una donación concreta para quienes más lo necesitan.",
        },
      ],
    },
    community: {
      title: "La comunidad Donasaurio",
      subtitle:
        "Personas que transforman lo que ya no usan en impacto real. Sin drama, sin culpa. Solo acción.",
      traits: [
        "Gente práctica que quiere ayudar de forma inteligente",
        "Una comunidad moderna con propósito claro",
        "Personas que entienden que dar no tiene que ser complicado",
        "Quienes saben que un pequeño gesto puede cambiar mucho",
      ],
    },
    manifesto: {
      line1: "No todo el mundo puede donar dinero.",
      line2: "Pero todo el mundo puede ayudar.",
    },
    finalCta: {
      headline: "Haz espacio. Haz impacto.",
      button: "Empieza ahora",
    },
  },
  en: {
    meta: {
      title: "Donasaurio - A way for everyone to help",
      description:
        "Give what you no longer use and turn objects into real donations.",
    },
    nav: {
      brand: "Donasaurio",
      explore: "Explore",
      listItem: "List item",
      myOrders: "My orders",
      signIn: "Sign in",
      signOut: "Sign out",
      loading: "Loading...",
    },
    hero: {
      claim: "A way for everyone to help.",
      subclaim:
        "Give what you no longer use and turn objects into real donations.",
      ctaPrimary: "List an item",
      ctaSecondary: "Explore items",
    },
    howItWorks: {
      title: "This simple",
      subtitle: "Three steps. Zero hassle.",
      steps: [
        {
          number: "1",
          title: "List something you no longer use",
          description:
            "Upload a photo, add a title, done. Your item starts its new life.",
        },
        {
          number: "2",
          title: "Someone donates to an NGO",
          description:
            "Another person picks your item and makes a direct donation to a social organization.",
        },
        {
          number: "3",
          title: "Deliver the item and create impact",
          description:
            "You coordinate the delivery, and your item becomes real help.",
        },
      ],
      note: "The donation goes directly to the NGO. Donasaurio never touches the money.",
    },
    whyDifferent: {
      title: "Why Donasaurio is different",
      points: [
        {
          title: "Not everything needs to be sold",
          description:
            "Some things are worth more when given away. Here, your items serve a bigger purpose.",
        },
        {
          title: "Not everything needs to be thrown away",
          description:
            "Before discarding, think about who might need it. Give your things a second life.",
        },
        {
          title: "Help without spending money",
          description:
            "You don't need to open your wallet. Just open a drawer.",
        },
        {
          title: "Second life, real impact",
          description:
            "Every item you give away becomes a real donation for those who need it most.",
        },
      ],
    },
    community: {
      title: "The Donasaurio community",
      subtitle:
        "People who turn what they no longer use into real impact. No drama, no guilt. Just action.",
      traits: [
        "Practical people who want to help in a smart way",
        "A modern community with a clear purpose",
        "People who understand that giving doesn't have to be complicated",
        "Those who know a small gesture can change a lot",
      ],
    },
    manifesto: {
      line1: "Not everyone can donate money.",
      line2: "But everyone can help.",
    },
    finalCta: {
      headline: "Make space. Make impact.",
      button: "Start now",
    },
  },
};
