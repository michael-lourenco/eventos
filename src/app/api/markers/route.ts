// app/api/markers/route.ts

import { NextResponse } from "next/server";
import { dbFirestore, addMarker, getMarkers, ProblemStatus, addStatusChange } from "@/services/firebase/FirebaseService";
import type { Marker } from "@/components/marker/types/marker";
import { validateAuth } from "@/lib/auth/api-auth";

// GET - Obter todos os marcadores
export async function GET() {
  try {
    const markers = await getMarkers(dbFirestore);
    return NextResponse.json(markers);
  } catch (error) {
    console.error("Erro ao obter marcadores:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Falha ao obter marcadores" 
    }, { status: 500 });
  }
}

// POST - Adicionar um novo marcador
export async function POST(request: Request) {
  try {

    const auth = await validateAuth(request);
    if (!auth.valid) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const markerData = await request.json() as Marker;
    
    if (!markerData.id || !markerData.lat || !markerData.lng || !markerData.type) {
      return NextResponse.json({ 
        error: 'Dados incompletos. id, lat, lng e type são obrigatórios' 
      }, { status: 400 });
    }
    
    markerData.userEmail = auth.user.email;
    
    markerData.createdAt = new Date();
    
    markerData.likedBy = [];
    markerData.resolvedBy = [];
    
    markerData.currentStatus = ProblemStatus.REPORTED;
    
    await addMarker(dbFirestore, markerData);
    
    await addStatusChange(
      markerData.id,
      ProblemStatus.REPORTED,
      "Problema reportado inicialmente",
      auth.user.email
    );
    
    return NextResponse.json({
      success: true,
      message: 'Marcador adicionado com sucesso',
      marker: markerData
    });
  } catch (error) {
    console.error("Erro ao adicionar marcador:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Falha ao adicionar marcador" 
    }, { status: 500 });
  }
}
