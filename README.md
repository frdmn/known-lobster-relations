# known-lobster-relations

![](https://i.imgur.com/wVu2wdS.png)

🦞 Simple CLI tool to find available relations on GitHub that might be able to invite you to Lobsters (https://lobste.rs/).

## Installation

1. Make sure you've installed all requirements
2. Clone this repository:

    ```shell
    git clone https://github.com/frdmn/known-lobster-relations
    ```

3. Install all dependencies using `npm`:

    ```shell
    npm install
    ```

4. Copy and edit the default configuration file, make sure to add your personal [GitHub access token](https://github.com/settings/tokens):

    ```shell
    cp sample.config.json config.json
    ```

## Usage

Here's a short explanation how to use `known-lobster-relations`:

```shell
npm start
```

## Contributing

1. Fork it
2. Create your feature branch:

    ```shell
    git checkout -b feature/my-new-feature
    ```

3. Commit your changes:

    ```shell
    git commit -am 'Add some feature'
    ```

4. Push to the branch:

    ```shell
    git push origin feature/my-new-feature
    ```

5. Submit a pull request

## Requirements / Dependencies

* NodeJS
* [GitHub access token](https://github.com/settings/tokens) (only read-only permissions to user neccessary)

## Version

1.0.0

## License

[MIT](LICENSE)
