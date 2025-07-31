# Data Directory

This directory is reserved for data files, imports, and external datasets.

## Planned Contents

```
data/
├── imports/               # Card data imports
│   ├── pokemon/           # Pokemon card datasets
│   ├── magic/             # Magic card datasets  
│   ├── yugioh/            # Yu-Gi-Oh card datasets
│   └── lorcana/           # Lorcana card datasets
├── exports/               # Data exports and backups
│   ├── collections/       # User collection exports
│   └── reports/           # Analytics reports
├── market/                # Market price data
│   ├── tcgplayer/         # TCGPlayer API data
│   └── historical/        # Price history files
└── images/                # Card images and assets
    ├── pokemon/           # Pokemon card images
    ├── magic/             # Magic card images
    ├── yugioh/            # Yu-Gi-Oh card images
    └── lorcana/           # Lorcana card images
```

## Data Sources (Future Integration)

- **TCGPlayer API** - Market prices and card data
- **Scryfall API** - Magic: The Gathering comprehensive data
- **PokémonTCG API** - Pokemon card information
- **Yu-Gi-Oh API** - Yu-Gi-Oh card database
- **Ravensburger API** - Disney Lorcana official data

## Data Management

- **Automated imports** from various TCG APIs
- **Data validation** against database schemas
- **Image optimization** and CDN integration
- **Market price updates** with historical tracking
- **Export utilities** for user data portability

## File Formats

- **JSON** - Primary format for API data and exports
- **CSV** - For bulk imports and user-friendly exports
- **SQL** - Database dumps and migration files
- **Images** - JPG/PNG for card images, WebP for optimization
