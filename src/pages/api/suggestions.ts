import type { NextApiRequest, NextApiResponse } from "next";
import { queryParamFrom } from "~/utils/queryParamFrom";
import { z } from "zod";

const SuggestionsSchema = z
  .tuple([z.unknown(), z.array(z.string())])
  .rest(z.unknown());

type Data = string[];

const HOST = "pl.wiktionary.org";
const PATH = "w/api.php";
const QUERY = [
  "action=opensearch",
  "format=json",
  "formatversion=2",
  "namespace=0",
  "limit=10",
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const query = queryParamFrom("query", req.query);
  const q = [...QUERY, `search=${query}`].join("&");
  const response = await fetch(`https://${HOST}/${PATH}?${q}`);
  const json: unknown = await response.json();
  const parsed = SuggestionsSchema.safeParse(json);
  if (parsed.success) {
    res.status(200).json(parsed.data[1]);
  } else {
    res.status(200).json([]);
  }
}
