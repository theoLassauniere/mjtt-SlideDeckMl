# SlideDeckML

## Équipe

**Nom de l’équipe :**  
Equipe MJTT

**Membres :**
- Théo Lassaunière
- Thibault Ripoche
- Mathis Jullien
- Julie Seyier

## Objectif du projet

L’objectif de ce projet est de concevoir et implémenter un **langage spécifique au domaine (DSL)** nommé **SlideDeckML**, permettant de décrire des présentations de diapositives pour ensuite les générer en langages web.

À partir d’un fichier SlideDeckML, le projet génère automatiquement une présentation HTML basée sur **Reveal.js**.

Le projet repose sur **Langium** pour la définition de la grammaire, l’AST, la validation et la génération.

## Cloner et lancer le projet

### Cloner le dépôt

```bash
git clone https://github.com/theoLassauniere/mjtt-SlideDeckMl.git
cd mjtt-SlideDeckMl
```

### Lancer le projet

#### Installation et build

```bash
npm install
npm run build
```

#### Générer une présentation

Lancer l'extension VSCode avec F5 où Run and Debug (Ctrl + Shift + D) > Run Extension

Dans un terminal run (avec test.sdml un fichier sdml dans le dossier demo):

```bash
node ../packages/cli/bin/cli generate .\test.sdml
```

Le fichier html généré se trouvera dans demo/generated.

## Scénarios disponibles

Les scénarios de démonstration des fonctionnalitées de SlideDeckML sont disponibles à la racine du dossier demo et sont :
- extensions_examples.sdml pour démontrer les fonctionnalités de nos extensions
- student_scenario.sdml pour démontrer les fonctionnalités de notre langage selon le scénario 1 de l'énoncé
- teacher_scenario.sdml pour démontrer les fonctionnalités de notre langage selon le scénario 2 de l'énoncé
- validation_error_example.sdml pour montrer les warnings et cas d'erreurs repérés par notre validateur

## Grammaire de SlideDeckML

// mettre l'image de la grammaire ici

## Extensions

Nous avons mis en place les extensions suivantes dans notre langage :
- Support for Slide Annotations
- DSL Extension for Mathematical Equations
