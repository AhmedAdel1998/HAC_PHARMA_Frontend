/**
 * Represents a phase in the company roadmap
 */
export interface RoadmapPhase {
    title: string;
    items: string[];
    icon: string;
}

/**
 * Represents a service offered by the company
 */
export interface Service {
    title: string;
    description: string;
    icon: string;
}

/**
 * Represents a product category
 */
export interface Product {
    title: string;
    icon: string;
}

/**
 * Represents an impact/achievement metric
 */
export interface Impact {
    number: string;
    title: string;
    description: string;
}

/**
 * Represents a statistic display item
 */
export interface Stat {
    value: string;
    label: string;
}

/**
 * Represents the contact form data
 */
export interface ContactForm {
    name: string;
    email: string;
    phone: string;
    message: string;
}
