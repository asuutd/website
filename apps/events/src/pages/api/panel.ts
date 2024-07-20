import type { NextApiRequest, NextApiResponse } from "next";
import { renderTrpcPanel } from "trpc-panel";
import { appRouter } from "../../server/trpc/router/index";
import { env } from '../../env/server.mjs';

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
    if (env.NODE_ENV === "production") {
        res.status(404).end();
        return;
    }
    res.status(200).send(
        renderTrpcPanel(appRouter, {
            url: env.NEXTAUTH_URL + "/api/trpc",
            transformer: "superjson",
        })
    );
}