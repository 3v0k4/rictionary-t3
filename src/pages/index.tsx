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

const Home: NextPage<{ query: string }> = ({ query }) => {
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
          <main>
            <section className="logo">
              <i className="logo__icon">
                <Logo />
              </i>
            </section>

            <Form query={query} />

            <section className="onboarding">
              <p>First time here?</p>

              <p>
                Search for a word in any language to find the Polish definition.
                Or try the following examples:
              </p>

              <ul className="tags">
                <Tag query="sklep" />
                <Tag query="shop" />
                <Tag query="negozio" />
                <Tag query="tienda" />
              </ul>
            </section>
          </main>
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
              <li>
                <kbd className="shortcuts__shortcut-icon">w</kbd>
                <span>Wiktionary</span>
              </li>
              <li>
                <kbd className="shortcuts__shortcut-icon">b</kbd>
                <span>bab.la</span>
              </li>
              <li>
                <kbd className="shortcuts__shortcut-icon">b</kbd>
                <span>bab.la</span>
              </li>
            </ul>
          </section>
        </div>

        <footer className="footer">
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

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const _ = await Promise.resolve();
  return { props: { query: queryParamFrom("query", query) } };
};

export default Home;
