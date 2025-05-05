---
title: "Projects"
---

# My Projects

Here's a collection of projects I've worked on recently. Each demonstrates different aspects of my skills and interests in web development and design.

## StyleMD Theme Creator

A tool for creating custom themes for StyleMD markdown-to-HTML converter.

```mermaid
graph TD
    A[Markdown Input] --> B[StyleMD Processor]
    B --> C{Theme Selection}
    C -->|Default| D[Standard HTML]
    C -->|Custom| E[Themed HTML]
    E --> F[CSS Styling]
    D --> G[Final Output]
    F --> G
```

**Technologies:** JavaScript, Handlebars, CSS
**GitHub:** [View Project](#)

![Project Screenshot](https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80)

## Personal Portfolio Website

A responsive portfolio website showcasing my work and skills.

**Technologies:** HTML, CSS, JavaScript
**Live Demo:** [View Website](#)

## Weather Dashboard App

A web application that provides real-time weather information for locations worldwide.

| Feature | Description |
|---------|-------------|
| Current Conditions | Real-time weather data |
| 5-Day Forecast | Extended weather prediction |
| Location Search | Search for any city globally |
| Weather Maps | Interactive weather maps |

**Technologies:** React, OpenWeather API, Leaflet.js
**GitHub:** [View Project](#)

## E-commerce Platform

A full-stack e-commerce solution with product management, shopping cart, and payment processing.

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Database
    participant PaymentGateway
    
    User->>Frontend: Browse Products
    Frontend->>API: Request Products
    API->>Database: Query Products
    Database->>API: Return Products
    API->>Frontend: Display Products
    User->>Frontend: Add to Cart
    User->>Frontend: Checkout
    Frontend->>PaymentGateway: Process Payment
    PaymentGateway->>Frontend: Payment Confirmation
    Frontend->>API: Create Order
    API->>Database: Store Order
```

**Technologies:** Node.js, Express, MongoDB, Stripe, React
**GitHub:** [View Project](#)