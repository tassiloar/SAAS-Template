"use client"

import Link from 'next/link'

export default function handler() {

  const handleLogOut = async () => {

    await fetch('/api/removeAuthTokens', {
      method: "GET"
    })

    window.location.reload();
  }

  return (
    <>

    </>
  );
}
