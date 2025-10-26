import React from "react"
import { ImageResponse } from "next/og"

export const runtime = "edge"

const navy = "#1a2337"
const wheat = "#dca34b"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get("title") ?? "Find the needle. Faster."

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: navy,
          color: "#f8ebd3",
          fontFamily: "Sora",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 160,
            height: 160,
            borderRadius: 9999,
            backgroundColor: "#0d1221",
            border: `2px solid ${wheat}`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {[...Array(12)].map((_, index) => (
            <div
              key={index}
              style={{
                width: 6,
                height: 140,
                backgroundColor: index === 5 ? wheat : "rgba(248, 235, 211, 0.3)",
                marginLeft: 6,
                borderRadius: 9999,
              }}
            />
          ))}
        </div>
        <h1
          style={{
            fontSize: 62,
            fontWeight: 600,
            marginTop: 48,
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: 720,
          }}
        >
          {title}
        </h1>
        <p style={{ marginTop: 24, fontSize: 28, opacity: 0.7 }}>Haystack — Signal over noise for AI & data hiring.</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
