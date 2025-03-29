"use client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import React from "react"
import data from "@/data/index.json"

interface collegeDataTypes {
    college_name: string;
    college_quote: string;
    github_link : string;
}

const NavBar: React.FC = () => {

    const collegeData: collegeDataTypes = data;
    if (!collegeData) {
        console.log("data is not available");
    }

    return (
        <div className="w-full bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                                <Image
                                    src="/images/logo.png"
                                    alt="Dronacharya College Logo"
                                    height={50}
                                    width={50}
                                    unoptimized
                                    loading="lazy"
                                    className="w-10 h-10 md:w-12 md:h-12 object-contain"
                                />
                            </div>
                            <div className="hidden md:block">
                                <h1 className="text-gray-900 font-medium text-sm md:text-base lg:text-lg">
                                    {collegeData.college_name}
                                </h1>
                                <p className="text-xs text-gray-500 italic hidden lg:block">
                                    {collegeData.college_quote}
                                </p>
                            </div>
                        </Link>
                    </div>



                    <div className="hidden md:flex md:items-center md:space-x-6">
                        <Button asChild size="sm" className="ml-2">
                            <Link href={collegeData.github_link}>
                                <span className="flex items-center">
                                    Github
                                    <span className="relative flex h-2 w-2 ml-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                </span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>


        </div >
    )
}

export default NavBar

