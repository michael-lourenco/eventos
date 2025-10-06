// useProblemReport.ts
"use client"
import { TProblemType } from "@/constants/map-constants"
import { useEffect, useState } from "react"


export function useProblemReport() {
    const [selectedProblemType, setSelectedProblemType] = useState<TProblemType>()
    const [userConfirmedProblem, setUserConfirmedProblem] = useState(false)

    const handleProblemSelect = (problemType: TProblemType | undefined) => {
        setSelectedProblemType(problemType)
    }

    const handleConfirmProblem = () => {
        console.log("Confirmando problema:", selectedProblemType)
        setUserConfirmedProblem(true)
    }

    const resetConfirmation = () => {
        setUserConfirmedProblem(false)
    }

    // Reset confirmation state after it's been processed
    useEffect(() => {
        if (userConfirmedProblem) {
            console.log("useEffect detectou userConfirmedProblem como true")
            const timer = setTimeout(resetConfirmation, 1000)
            return () => clearTimeout(timer)
        }
    }, [userConfirmedProblem])

    return {
        selectedProblemType,
        userConfirmedProblem,
        handleProblemSelect,
        handleConfirmProblem,
        resetConfirmation
    }
}