import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initalProps = await Document.getInitialProps(ctx)

        return initalProps
    }

    render() {
        return (
            <Html>
                <Head>
                    
                </Head>
                <body className='bg-blue-50' style={{ backgroundImage: 'linear-gradient( to right, rgb(191 219 254 / .1), rgb( 191 219 254 / .1) ), url(/img/bg-pattern-light.png)' }}>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument