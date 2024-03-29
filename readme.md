# Getting Started

> Note: This template is not compatible with Jupyter Notebook v7. Specifically, requires `notebook<7` and `ipywidgets<8`

## First-Time Setup

### 1. Clone the repository

First, clone this repo with the following commands.

```sh
# Clone the repository from git
git clone git@github.com:koreanwglasses/jupyter-react-widget-template.git

# cd into cloned repo
cd jupyter-react-widget-template
```

### 2. Install dependencies

Next, install dependencies with the following commands.

> Recommended: use `pipenv` to simplify managing python packages and virtual environments. Read more [here](https://pipenv.pypa.io/en/latest/).

```sh
# Creates a virtual environment and installs idependencies
pipenv install --dev

# Install javascript dependencies
yarn install # or `npm install`
```

### 3. (Optional) Rename your package

To rename your package, simply rename the `src/mypackage` directory and replace `name = "mypackage"` in `pyproject.toml`. Then, update the entry point and output of the base configuration in `webpack.config.ts` like so:

```ts
/** webpack.config.ts **/
/* ... */
const base: Configuration = {
    entry: "./src/your-package-name"
    /* ... */
    output: {
        /* ... */
        path: path.resolve(__dirname, "src/your-package-name"),
    }
    /* ... */
}
/* ... */
```

Finally, update the `NAME` constant in `src/your-package-name/core/idom_loader.py`.
## Building and Debugging

Use the following command to build the package to `dist`.

> Note that we use yarn/npm to build, which ensures that the JavaScript/TypeScript files are bundled before the python module is built from the `src` folder

```sh
# Build package for deployment
yarn build # or `npm run build`
```

To get started debugging, first run the following command to "install" your package. This creates a symlink to your source, allowing you to make changes that are reflected immediately without requiring a rebuild. Read more on how it works [here](https://pip.pypa.io/en/stable/topics/local-project-installs/#editable-installs). This only needs to be done once.

```sh
# Install your package locally
pipenv run pip install -e .
```

Run the following command to re-bundle the TypeScript/JavaScript whenever there is a change.

```sh
# Watch files and bundle on change
yarn watch # or `npm run watch`
```

Finally, in a separate shell, start up a Jupyter Notebook instance with the following command and follow the instructions in the terminal to start testing your module in a notebook.

```sh
# Start Jupyter Notebook
pipenv run jupyter notebook
```

## Creating a Widget

Follow these steps to create a widget. Look at `src/widgets/sample.py` and `src/widgets/sample.tsx` for examples. For these steps, we will assume your widget is called `mywidget`.

### 1. Create source files

Create a `mywidget.py` and a `mywidget.tsx` in `src/widgets` as follows. Note that these files can be placed anywhere, as long as they are exported properly in step n.

```
.
└── src
    └── widgets
        ├── mywidget.py
        └── mywidget.tsx
```

### 2. Create your widget
