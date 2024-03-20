import React, { useState, useEffect } from "react"
import { onEntryChange } from "../contentstack-sdk"
import RenderComponents from "../components/render-components"
import { getPageRes } from "../helper"
import Skeleton from "react-loading-skeleton"
import { Props } from "../typescript/pages"

console.log(process.env.CDN_HOST)

export default function Page(props: Props) {
	const { page, entryUrl } = props
	const [getEntry, setEntry] = useState(page)

	useEffect(() => {
		async function fetchData() {
			try {
				const entryRes = await getPageRes(entryUrl)
				if (!entryRes) throw new Error("Status code 404")
				setEntry(entryRes)
			} catch (error) {
				console.error(error)
			}
		}
		fetchData()
	}, [page, entryUrl])

	return getEntry.page_components ? (
		<RenderComponents pageComponents={getEntry.page_components} contentTypeUid="page" entryUid={getEntry.uid} locale={getEntry.locale} />
	) : (
		<Skeleton count={3} height={300} />
	)
}

export async function getStaticProps({ params }: any) {
	try {
		const entryUrl = params.page.includes("/") ? params.page : `/${params.page}`
		const entryRes = await getPageRes(entryUrl)
		if (!entryRes) throw new Error("404")
		return {
			props: {
				entryUrl: entryUrl,
				page: entryRes,
			},
		}
	} catch (error) {
		return { notFound: true }
	}
}

export async function getStaticPaths() {
	const paths = ["about-us", "contact-us"].map((p) => {
		return { params: { page: p } }
	})
	return { paths, fallback: false }
}
