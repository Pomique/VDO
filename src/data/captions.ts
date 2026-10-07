import { DynamicCaption } from '../types';

export const DYNAMIC_CAPTIONS: DynamicCaption[] = [
  // Scène 1 : Accroche (0 - 9s)
  {
    id: 'cap-1',
    startTime: 0,
    endTime: 3,
    shortText: 'Un SMS vous annonce un colis bloqué ?',
    highlightWord: 'colis bloqué',
    badge: 'SMS SUSPECT',
  },
  {
    id: 'cap-2',
    startTime: 3,
    endTime: 6,
    shortText: 'Urgence artificielle : dernier passage avant retour.',
    highlightWord: 'Urgence artificielle',
    badge: 'PIÈGE CLASSIQUE',
  },
  {
    id: 'cap-3',
    startTime: 6,
    endTime: 9,
    shortText: 'Le piège absolu : un lien suspect à cliquer.',
    highlightWord: 'lien suspect',
    badge: 'ATTENTION',
  },

  // Scène 2 : Contexte & Stats (9 - 19s)
  {
    id: 'cap-4',
    startTime: 9,
    endTime: 12,
    shortText: 'Vous avez tous déjà reçu cette fausse notification.',
    highlightWord: 'fausse notification',
    badge: 'EXPÉRIENCE COMMUNE',
  },
  {
    id: 'cap-5',
    startTime: 12,
    endTime: 15,
    shortText: 'Le seul but des escrocs : forcer votre clic.',
    highlightWord: 'forcer votre clic',
    badge: 'OBJECTIF ESCROCS',
  },
  {
    id: 'cap-6',
    startTime: 15,
    endTime: 17,
    shortText: 'Plus de 53% des Français déjà visés.',
    highlightWord: '53% des Français',
    badge: 'STAT OFFICIELLE',
  },
  {
    id: 'cap-7',
    startTime: 17,
    endTime: 19,
    shortText: 'Cette arnaque porte un nom : le phishing.',
    highlightWord: 'le phishing',
    badge: 'DÉFINITION',
  },

  // Scène 3 : Définition (19 - 29s)
  {
    id: 'cap-8',
    startTime: 19,
    endTime: 21.5,
    shortText: 'Des pirates imitent des expéditeurs de confiance.',
    highlightWord: 'expéditeurs de confiance',
    badge: 'USURPATION',
  },
  {
    id: 'cap-9',
    startTime: 21.5,
    endTime: 24,
    shortText: 'Faux livreur, fausse banque ou fausse administration.',
    highlightWord: 'Faux livreur',
    badge: 'IMITATIONS',
  },
  {
    id: 'cap-10',
    startTime: 24,
    endTime: 26.5,
    shortText: 'Ils veulent vos données personnelles et mots de passe.',
    highlightWord: 'données personnelles',
    badge: 'CIBLE',
  },
  {
    id: 'cap-11',
    startTime: 26.5,
    endTime: 29,
    shortText: 'Ou vider directement votre compte bancaire.',
    highlightWord: 'compte bancaire',
    badge: 'DANGER',
  },

  // Scène 4 : Transition (29 - 31s)
  {
    id: 'cap-12',
    startTime: 29,
    endTime: 31,
    shortText: 'Les 3 réflexes immédiats pour vous protéger.',
    highlightWord: '3 réflexes immédiats',
    badge: 'QUE FAIRE ?',
  },

  // Scène 5 : Règle 1 (31 - 37s)
  {
    id: 'cap-13',
    startTime: 31,
    endTime: 34,
    shortText: 'Inspectez toujours l’adresse web du lien reçu.',
    highlightWord: 'Inspectez toujours',
    badge: 'RÈGLE 1',
  },
  {
    id: 'cap-14',
    startTime: 34,
    endTime: 37,
    shortText: 'Une seule lettre fausse trahit l’arnaque.',
    highlightWord: 'Une seule lettre fausse',
    badge: 'INDICE CLÉ',
  },

  // Scène 6 : Règle 2 (37 - 42s)
  {
    id: 'cap-15',
    startTime: 37,
    endTime: 39.5,
    shortText: 'Ne cliquez jamais sur le lien du SMS.',
    highlightWord: 'Ne cliquez jamais',
    badge: 'RÈGLE 2',
  },
  {
    id: 'cap-16',
    startTime: 39.5,
    endTime: 42,
    shortText: 'Allez directement sur le site officiel du transporteur.',
    highlightWord: 'site officiel',
    badge: 'RÉFLEXE SÉCURITÉ',
  },

  // Scène 7 : Règle 3 (42 - 47s)
  {
    id: 'cap-17',
    startTime: 42,
    endTime: 44.5,
    shortText: 'Transférez le SMS suspect au numéro 33700.',
    highlightWord: 'au numéro 33700',
    badge: 'RÈGLE 3',
  },
  {
    id: 'cap-18',
    startTime: 44.5,
    endTime: 47,
    shortText: 'Bloquez le domaine sur signal-spam.fr.',
    highlightWord: 'signal-spam.fr',
    badge: 'ACTION CITOYENNE',
  },

  // Scène 8 : Paramètres iPhone / Android (47 - 58s)
  {
    id: 'cap-19',
    startTime: 47,
    endTime: 49.5,
    shortText: 'Une action simple à régler en 2 minutes chrono.',
    highlightWord: '2 minutes chrono',
    badge: 'ACTION RAPIDE',
  },
  {
    id: 'cap-20',
    startTime: 49.5,
    endTime: 52.5,
    shortText: 'Sur iPhone : activez Filtrer les inconnus dans Messages.',
    highlightWord: 'Filtrer les inconnus',
    badge: 'IOS FILTRE',
  },
  {
    id: 'cap-21',
    startTime: 52.5,
    endTime: 55.5,
    shortText: 'Sur Android : ouvrez l’application Messages Google.',
    highlightWord: 'Messages Google',
    badge: 'ANDROID',
  },
  {
    id: 'cap-22',
    startTime: 55.5,
    endTime: 58,
    shortText: 'Activez la protection contre le spam dans Paramètres.',
    highlightWord: 'protection contre le spam',
    badge: 'ANTI-SPAM ACTIF',
  },

  // Scène 9 : Conclusion (58 - 65s)
  {
    id: 'cap-23',
    startTime: 58,
    endTime: 61.5,
    shortText: 'Le filtre réduit les arnaques mais ne supprime rien.',
    highlightWord: 'réduit les arnaques',
    badge: 'RAPPEL',
  },
  {
    id: 'cap-24',
    startTime: 61.5,
    endTime: 65,
    shortText: 'Le meilleur bouclier reste votre vigilance : zéro clic.',
    highlightWord: 'zéro clic',
    badge: 'RÉFLEXE ULTIME',
  },
];
