// One list of publications, read by the CV (/cv/) and the publications page (/publications/).
// To add a paper, add it here only.

export const ME = 'Papastefanopoulos, V.';

export interface Badge {
  label: string;
  href: string;
}

export interface Paper {
  authors: string[];
  year: number;
  title: string; // may hold inline HTML, e.g. CO<sub>2</sub>
  venue: string;
  venueNote?: string; // shown after the venue, e.g. "Conference Paper"
  details: string; // volume, issue, pages or article number
  doi?: string;
  link?: Badge; // when there is no DOI
  sjr?: string; // SCImago (= Scopus) source id of the journal
  awards?: Badge[];
}

export interface Book {
  authors: string[];
  year: number;
  title: string;
  titleEn: string;
  publisher: string;
  url: string;
  isbn: string;
  eudoxus: string;
}

export const journalArticles: Paper[] = [
  {
    authors: [ME, 'Linardatos, P.', 'Kotsiantis, S.'],
    year: 2025,
    title: 'Combining normalizing flows with decision trees for interpretable unsupervised outlier detection',
    venue: 'Engineering Applications of Artificial Intelligence',
    details: '141, 109770',
    doi: '10.1016/j.engappai.2024.109770',
    sjr: '24182',
  },
  {
    authors: ['Linardatos, P.', ME, 'Kotsiantis, S.'],
    year: 2024,
    title: 'Regressor cascading for time series forecasting',
    venue: 'Intelligent Decision Technologies',
    details: '18(2), 1139-1156',
    doi: '10.3233/IDT-240224',
    sjr: '21100211724',
  },
  {
    authors: ['Linardatos, P.', ME, 'Panagiotakopoulos, T.', 'Kotsiantis, S.'],
    year: 2023,
    title: 'CO<sub>2</sub> concentration forecasting in smart cities using a hybrid ARIMA-TFT model on multivariate time series IoT data',
    venue: 'Scientific Reports',
    details: '13(1), 17266',
    doi: '10.1038/s41598-023-42346-0',
    sjr: '21100200805',
  },
  {
    authors: [ME, 'Linardatos, P.', 'Panagiotakopoulos, T.', 'Kotsiantis, S.'],
    year: 2023,
    title: 'Multivariate time-series forecasting: A review of deep learning methods in internet of things applications to smart cities',
    venue: 'Smart Cities',
    details: '6(5), 2519-2552',
    doi: '10.3390/smartcities6050114',
    sjr: '21101068929',
    awards: [{ label: 'Best Paper Award', href: 'https://www.mdpi.com/about/announcements/11391' }],
  },
  {
    authors: [ME, 'Linardatos, P.', 'Kotsiantis, S.'],
    year: 2021,
    title: 'Unsupervised outlier detection: A meta-learning algorithm based on feature selection',
    venue: 'Electronics',
    details: '10(18), 2236',
    doi: '10.3390/electronics10182236',
    sjr: '21100829272',
  },
  {
    authors: ['Linardatos, P.', ME, 'Kotsiantis, S.'],
    year: 2020,
    title: 'Explainable AI: A review of machine learning interpretability methods',
    venue: 'Entropy',
    details: '23(1), 18',
    doi: '10.3390/e23010018',
    sjr: '13715',
    awards: [{ label: 'Most Cited Paper in Entropy', href: 'https://www.mdpi.com/journal/entropy/most_cited' }],
  },
  {
    authors: [ME, 'Linardatos, P.', 'Kotsiantis, S.'],
    year: 2020,
    title: 'COVID-19: A comparison of time series methods to forecast percentage of active cases per population',
    venue: 'Applied Sciences',
    details: '10(11), 3880',
    doi: '10.3390/app10113880',
    sjr: '21100829268',
  },
];

export const conferencePapers: Paper[] = [
  {
    authors: [ME, 'Karlos, S.', 'Kotsiantis, S.'],
    year: 2017,
    title: 'Using Semi-Supervised Learning Methods for Credit Score Problem',
    venue: 'Advances in Smart Systems Research',
    venueNote: 'Conference Paper',
    details: '6(2), 28-40',
    link: { label: 'PDF', href: 'http://nimbusvault.net/publications/koala/assr/papers/k17is-222.pdf' },
  },
];

export const books: Book[] = [
  {
    authors: ['Kotsiantis, S.', ME, 'Tsihrintzis, G.', 'Floros, A.'],
    year: 2026,
    title: 'Μηχανική Μάθηση με Python',
    titleEn: 'Machine Learning with Python',
    publisher: 'Εκδόσεις Παπαζήση',
    url: 'https://papazissi.gr/el/products/michaniki-mathisi-me-python',
    isbn: '978-960-02-4712-1',
    eudoxus: '153585239',
  },
  {
    authors: ['Verykios, V.', 'Vasileiadis, V.', 'Kotsiantis, S.', ME, 'Tzagarakis, M.'],
    year: 2026,
    title: 'Βάσεις Δεδομένων: Από τον Σχεδιασμό στις Εφαρμογές',
    titleEn: 'Databases: From Design to Applications',
    publisher: 'Εκδόσεις Gutenberg',
    url: 'https://www.dardanosnet.gr/product/vaseis-dedomenon/',
    isbn: '978-960-01-2785-0',
    eudoxus: '153582139',
  },
  {
    authors: ['Verykios, V.', 'Kotsiantis, S.', ME, 'Tzagarakis, M.'],
    year: 2026,
    title: 'Python: Εισαγωγή στον Προγραμματισμό',
    titleEn: 'Python: An Introduction to Programming',
    publisher: 'Εκδόσεις Νέων Τεχνολογιών',
    url: 'https://newtech-pub.com/%CE%B2%CE%B9%CE%B2%CE%BB%CE%AF%CE%B1/%cf%80%ce%bb%ce%b7%cf%81%ce%bf%cf%86%ce%bf%cf%81%ce%b9%ce%ba%ce%ae/%ce%b3%ce%bb%cf%8e%cf%83%cf%83%ce%b5%cf%82-%cf%80%cf%81%ce%bf%ce%b3%cf%81%ce%b1%ce%bc%ce%bc%ce%b1%cf%84%ce%b9%cf%83%ce%bc%ce%bf%cf%8d/python-%ce%b5%ce%b9%cf%83%ce%b1%ce%b3%cf%89%ce%b3%ce%ae-%cf%83%cf%84%ce%bf%ce%bd-%cf%80%cf%81%ce%bf%ce%b3%cf%81%ce%b1%ce%bc%ce%bc%ce%b1%cf%84%ce%b9%cf%83%ce%bc%cf%8c/',
    isbn: '978-960-578-136-1',
    eudoxus: '153576086',
  },
];
