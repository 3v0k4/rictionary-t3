import { type NextPage, type GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Logo } from "~/components/Logo";
import { Form } from "~/components/Form";
import { Tag } from "~/components/Tag";
import { SearchIcon } from "~/components/SearchIcon";
import headshotRiccardo from "~/images/headshot-riccardo.jpg";
import headshotGosia from "~/images/headshot-gosia.jpg";
import { queryParamFrom } from "~/utils/queryParamFrom";
import { env } from "~/env.mjs";
import { Configuration, OpenAIApi } from "openai";

type Props =
  | { _kind: "NoQuery" }
  | { _kind: "NotFound"; query: string }
  | { _kind: "Ai"; query: string; translations: string[] }
  | { _kind: "Babla" }
  | { _kind: "Wiktionary" };

const Home: NextPage<Props> = (props) => {
  return (
    <>
      <Head>
        <title>Rictionary</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="The Polish dictionary that blows your socks off."
        />
      </Head>

      <div className="all">
        <div className="container">
          {props._kind === "NotFound" ? (
            <>
              <header>
                <Form query={props.query} klass="search__container--header" />
              </header>

              <main>
                <h1 className="searched-query">{props.query}</h1>

                <p>Not found.</p>

                <p>
                  If you are looking for a verb, make sure the term is
                  infinitive.
                  <br />
                  Otherwise, make sure the term is singular, masculine, and in
                  nominative case.
                </p>
              </main>
            </>
          ) : props._kind === "Ai" ? (
            <>
              <header>
                <Form query={props.query} klass="search__container--header" />
              </header>

              <main>
                <h1 id="corrected-query" className="searched-query">
                  {props.query}
                </h1>

                <section className="translations">
                  <h2 className="translations__heading">Translations</h2>

                  <ul className="translations__list">
                    {props.translations.map((translation) => (
                      <li className="translations__item">{translation}</li>
                    ))}
                  </ul>
                </section>
              </main>
            </>
          ) : (
            <main>
              <section className="logo">
                <i className="logo__icon">
                  <Logo />
                </i>
              </section>

              <Form query="" klass="search__container--main" />

              <section className="onboarding">
                <p>First time here?</p>

                <p>
                  Search for a word in any language to find the Polish
                  definition. Or try the following examples:
                </p>

                <ul className="tags">
                  <Tag query="sklep" />
                  <Tag query="shop" />
                  <Tag query="negozio" />
                  <Tag query="tienda" />
                </ul>
              </section>
            </main>
          )}
          <section
            id="previous-queries"
            className="previous-queries"
            style={{ display: "none" }}
          >
            <h2 className="previous-queries__heading">
              Previous Queries
              <button
                id="previous-queries__clear"
                className="previous-queries__clear"
                type="button"
                aria-label="clear previous queries"
              >
                <SearchIcon />
              </button>
            </h2>
            <ul className="tags">
              <Tag id="tags__template" query="QUERY" />
            </ul>
          </section>

          <section className="shortcuts">
            <ul className="shortcuts__list">
              <li>
                <kbd className="shortcuts__shortcut-icon">f</kbd>
                <span>Search</span>
              </li>
              {props._kind !== "Wiktionary" ? null : (
                <li>
                  <kbd className="shortcuts__shortcut-icon">w</kbd>
                  <span>Wiktionary</span>
                </li>
              )}
              {props._kind !== "Babla" ? null : (
                <li>
                  <kbd className="shortcuts__shortcut-icon">b</kbd>
                  <span>bab.la</span>
                </li>
              )}
            </ul>
          </section>
        </div>

        <footer className="footer">
          {props._kind === "NoQuery" ? null : (
            <section className="logo">
              <i className="logo__icon--footer">
                <Logo />
              </i>
            </section>
          )}

          <div className="footer__container">
            <Image
              src={headshotRiccardo}
              className="footer__headshot"
              alt="riccardo making a silly facial expression"
            />
            <div className="bubble bubble--right">
              <p className="bubble__text">
                Ciao, I&apos;m{" "}
                <Link
                  className="bubble__link"
                  target="_blank"
                  rel="noopener"
                  href="https://odone.io"
                >
                  Riccardo
                </Link>{" "}
                and I wrote this application to help me study Polish.
              </p>
            </div>
          </div>
          <div className="footer__container">
            <div className="bubble bubble--left">
              <p className="bubble__text">
                Cześć, I&apos;m{" "}
                <Link
                  className="bubble__link"
                  target="_blank"
                  rel="noopener"
                  href="https://dribbble.com/designaur"
                >
                  Gosia
                </Link>{" "}
                and I had a great time helping design this application.
              </p>
            </div>
            <Image
              src={headshotGosia}
              className="footer__headshot"
              alt="gosia smiling surrounded by artistic decorations"
            />
          </div>
        </footer>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
  req,
}) => {
  const q = queryParamFrom("query", query);
  if (q.length === 0) {
    return { props: { _kind: "NoQuery" } };
  } else {
    const completion = await (false
      ? withOpenAi(q)
      : false
      ? withStubbed(3)
      : withStubbed(0));
    const translations = completion.data.choices[0].message.content
      .split("\n")
      .map((translation: any) => translation.trim());
    if (translations.length === 3) {
      return {
        props: {
          _kind: "Ai",
          query: q,
          translations,
        },
      };
    } else {
      return {
        props: {
          _kind: "NotFound",
          query: q,
          translations,
        },
      };
    }
  }
};

const withStubbed = async (n: number) => {
  return Promise.resolve({
    data: {
      choices: [
        {
          message: {
            content: ["store ", "shop", "market"].slice(0, n).join("\n"),
          },
        },
      ],
    },
  } as const);
};

const withOpenAi = async (q: string) => {
  const configuration = new Configuration({
    apiKey: env.OPEN_AI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const completion: any = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `What are 3 translations of ${q} from Polish to English? Keep them short and separated by \n`,
      },
    ],
  });
  console.log(completion.data);
  console.log(completion.data.choices);
  console.log(completion.data.choices[0]);
  return completion as any;
};

// {
//   id: 'chatcmpl-6zglYPr4sl87dZ6YCox1WqlFtq9mB',
//   object: 'chat.completion',
//   created: 1680160420,
//   model: 'gpt-3.5-turbo-0301',
//   usage: { prompt_tokens: 29, completion_tokens: 14, total_tokens: 43 },
//   choices: [ { message: [Object], finish_reason: 'stop', index: 0 } ]
// }
// [
//   {
//     message: {
//       role: 'assistant',
//       content: '1. Inspiring\n2. Motivating\n3. Stimulating'
//     },
//     finish_reason: 'stop',
//     index: 0
//   }
// ]
// {
//   message: {
//     role: 'assistant',
//     content: '1. Inspiring\n2. Motivating\n3. Stimulating'
//   },
//   finish_reason: 'stop',
//   index: 0
// }

export default Home;
