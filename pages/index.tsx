import React, { useState, useEffect } from "react"
import { onEntryChange } from "../contentstack-sdk"
import RenderComponents from "../components/render-components"
import { getPageRes } from "../helper"
import Skeleton from "react-loading-skeleton"
import { Props, Context } from "../typescript/pages"

export default function Home(props: Props) {
	const { page, entryUrl } = props

	// const [getEntry, setEntry] = useState(page)

    return page ? (
		<RenderComponents pageComponents={page.page_components} contentTypeUid="page" entryUid={page.uid} locale={page.locale} />
	) : (
		<Skeleton count={3} height={300} />
	)
}

export async function getStaticProps(context: Context) {
	try {
		const entryRes = await getPageRes("/")
		return {
			props: {
				entryUrl: "/",
				page: entryRes,
			},
		}
	} catch (error) {
		return { notFound: true }
	}
}
