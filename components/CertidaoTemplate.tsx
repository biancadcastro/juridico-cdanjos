"use client";

import { Scale, Calendar, FileText, MapPin, Book } from "lucide-react";

interface CertidaoTemplateProps {
  numeroProcesso: string;
  titulo: string;
  cliente: string;
  partes: string[];
  cartorio: string;
  livro: string;
  folha: string;
  termo: string;
  dataRegistro: string;
  cidadeUF: string;
  valorCausa: number;
  dataAbertura: string;
  responsavel: string;
  desembargadora?: string;
}

export default function CertidaoTemplate({
  numeroProcesso,
  titulo,
  cliente,
  partes,
  cartorio,
  livro,
  folha,
  termo,
  dataRegistro,
  cidadeUF,
  valorCausa,
  dataAbertura,
  responsavel,
  desembargadora
}: CertidaoTemplateProps) {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Roboto:wght@400;500;700;900&family=Sacramento&display=swap" rel="stylesheet" />
      <div 
        id="certidao-template"
        style={{
          width: '794px',
          minHeight: '1123px',
          backgroundColor: '#ffffff',
          padding: '76px',
          margin: '0',
          position: 'relative',
          fontFamily: "'Poppins', sans-serif",
          boxSizing: 'border-box',
          overflow: 'visible'
        }}
      >
      <div 
        style={{
          borderBottom: '2px double #1e3a8a',
          paddingBottom: '8px',
          marginBottom: '15px',
          textAlign: 'center'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            backgroundColor: '#1e3a8a',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Scale style={{ width: '30px', height: '30px', color: 'white' }} />
          </div>
        </div>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: '900', 
          color: '#1e3a8a', 
          margin: '0 0 6px 0',
          textTransform: 'uppercase',
          letterSpacing: '4px',
          fontFamily: "'Roboto', sans-serif"
        }}>
          {cartorio}
        </h1>
        <p style={{ fontSize: '16px', color: '#4b5563', margin: '0 0 6px 0', fontWeight: '600', fontFamily: "'Poppins', sans-serif" }}>
          {cidadeUF}
        </p>
        <p style={{ fontSize: '12px', color: '#6b7280', margin: 0, fontStyle: 'italic', letterSpacing: '1px', fontFamily: "'Poppins', sans-serif" }}>
          "Cidade dos Anjos - Onde a justiça e o amor caminham juntos"
        </p>
      </div>

      <div style={{
        backgroundColor: '#eff6ff',
        padding: '12px',
        borderRadius: '6px',
        marginBottom: '15px',
        borderLeft: '3px solid #1e3a8a'
      }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: '900', 
          color: '#1e3a8a', 
          margin: '0 0 6px 0',
          textTransform: 'uppercase',
          letterSpacing: '3px',
          fontFamily: "'Roboto', sans-serif"
        }}>
          {titulo}
        </h2>
        <div style={{ display: 'flex', gap: '15px', fontSize: '12px', color: '#4b5563' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FileText style={{ width: '14px', height: '14px' }} />
            <span><strong>Processo:</strong> {numeroProcesso}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar style={{ width: '14px', height: '14px' }} />
            <span><strong>Emissão:</strong> {new Date(dataAbertura).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '15px', lineHeight: '1.5' }}>
        <p style={{ 
          fontSize: '14px', 
          color: '#1f2937', 
          textAlign: 'justify',
          marginBottom: '12px',
          textIndent: '30px',
          lineHeight: '1.6',
          fontWeight: '400',
          fontFamily: "'Poppins', sans-serif"
        }}>
          Certifico e dou fé que, neste {cartorio}, localizado na {cidadeUF}, 
          revendo os assentos lavrados no Livro {livro}, à Folha {folha}, 
          sob o Termo {termo}, consta registrado o seguinte:
        </p>

        <div style={{
          backgroundColor: '#f9fafb',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ marginBottom: '15px' }}>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 6px 0', fontWeight: '700', letterSpacing: '1.5px', fontFamily: "'Roboto', sans-serif" }}>
              REQUERENTE:
            </p>
            <p style={{ fontSize: '18px', color: '#1f2937', margin: 0, fontWeight: '600', fontFamily: "'Poppins', sans-serif" }}>
              {cliente}
            </p>
          </div>

          {partes.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 6px 0', fontWeight: '700', letterSpacing: '1.5px', fontFamily: "'Roboto', sans-serif" }}>
                PARTES INTERESSADAS:
              </p>
              {partes.map((parte, index) => (
                <p key={index} style={{ fontSize: '18px', color: '#1f2937', margin: '6px 0', fontWeight: '600', fontFamily: "'Poppins', sans-serif" }}>
                  • {parte}
                </p>
              ))}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 4px 0', fontWeight: 'bold' }}>
                DATA DO REGISTRO:
              </p>
              <p style={{ fontSize: '14px', color: '#1f2937', margin: 0 }}>
                {new Date(dataRegistro).toLocaleDateString('pt-BR', { 
                  day: '2-digit', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 4px 0', fontWeight: 'bold' }}>
                VALOR DA CAUSA:
              </p>
              <p style={{ fontSize: '14px', color: '#1f2937', margin: 0 }}>
                R$ {valorCausa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: '#fef3c7',
          padding: '10px',
          borderRadius: '6px',
          marginBottom: '12px',
          border: '1px solid #fbbf24'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Book style={{ width: '18px', height: '18px', color: '#92400e' }} />
            <p style={{ fontSize: '14px', color: '#92400e', margin: 0, fontWeight: 'bold' }}>
              DADOS DO REGISTRO
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', fontSize: '13px', color: '#78350f' }}>
            <div>
              <strong>Livro:</strong> {livro}
            </div>
            <div>
              <strong>Folha:</strong> {folha}
            </div>
            <div>
              <strong>Termo:</strong> {termo}
            </div>
          </div>
        </div>

        <p style={{ 
          fontSize: '14px', 
          color: '#1f2937', 
          textAlign: 'justify',
          marginTop: '12px',
          textIndent: '30px',
          lineHeight: '1.6',
          fontWeight: '400',
          fontFamily: "'Poppins', sans-serif"
        }}>
          O referido é verdade e dou fé. Nada mais havendo a declarar, dou por 
          encerrada a presente certidão, que vai devidamente assinada e selada 
          conforme determina a legislação vigente.
        </p>
      </div>

      <div style={{ marginTop: '30px' }}>
        <div style={{
          borderTop: '2px solid #e5e7eb',
          paddingTop: '15px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '15px',
            marginBottom: '15px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ 
                fontSize: '36px', 
                color: '#1e3a8a', 
                margin: '0', 
                fontWeight: '400', 
                fontFamily: "'Sacramento', cursive",
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
              }}>
                {desembargadora || 'Dra. Maria Silva'}
              </p>
              <div style={{
                borderBottom: '1px solid #1f2937',
                marginTop: '0px',
                marginBottom: '6px'
              }}></div>
              <p style={{ 
                fontSize: '14px', 
                color: '#1f2937', 
                margin: '0', 
                fontWeight: '700',
                fontFamily: "'Poppins', sans-serif"
              }}>
                {desembargadora || 'Dra. Maria Silva'}
              </p>
              <p style={{ 
                fontSize: '9px', 
                color: '#9ca3af', 
                margin: 0, 
                fontWeight: '400',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontFamily: "'Poppins', sans-serif"
              }}>
                Desembargadora
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <p style={{ 
                fontSize: '36px', 
                color: '#1e3a8a', 
                margin: '0', 
                fontWeight: '400', 
                fontFamily: "'Sacramento', cursive",
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
              }}>
                {cliente}
              </p>
              <div style={{
                borderBottom: '1px solid #1f2937',
                marginTop: '0px',
                marginBottom: '6px'
              }}></div>
              <p style={{ 
                fontSize: '14px', 
                color: '#1f2937', 
                margin: '0', 
                fontWeight: '700',
                fontFamily: "'Poppins', sans-serif"
              }}>
                {cliente}
              </p>
              <p style={{ 
                fontSize: '9px', 
                color: '#9ca3af', 
                margin: 0, 
                fontWeight: '400',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontFamily: "'Poppins', sans-serif"
              }}>
                Requerente
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <p style={{ 
                fontSize: '36px', 
                color: '#1e3a8a', 
                margin: '0', 
                fontWeight: '400', 
                fontFamily: "'Sacramento', cursive",
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
              }}>
                {responsavel}
              </p>
              <div style={{
                borderBottom: '1px solid #1f2937',
                marginTop: '0px',
                marginBottom: '6px'
              }}></div>
              <p style={{ 
                fontSize: '14px', 
                color: '#1f2937', 
                margin: '0', 
                fontWeight: '700',
                fontFamily: "'Poppins', sans-serif"
              }}>
                {responsavel}
              </p>
              <p style={{ 
                fontSize: '9px', 
                color: '#9ca3af', 
                margin: 0, 
                fontWeight: '400',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontFamily: "'Poppins', sans-serif"
              }}>
                Advogado(a) Responsável
              </p>
            </div>
          </div>
        </div>

        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <p style={{ fontSize: '10px', color: '#6b7280', margin: '0 0 6px 0', textAlign: 'center' }}>
            DOCUMENTO GERADO ELETRONICAMENTE
          </p>
          <p style={{ fontSize: '9px', color: '#9ca3af', margin: 0, textAlign: 'center' }}>
            Processo: {numeroProcesso} | Data de Emissão: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
          </p>
          <p style={{ fontSize: '9px', color: '#9ca3af', margin: '4px 0 0 0', textAlign: 'center' }}>
            Este documento possui validade jurídica conforme Lei nº 11.977/2009
          </p>
        </div>
      </div>

      {/* Marca d'água */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) rotate(-45deg)',
        fontSize: '120px',
        color: 'rgba(30, 58, 138, 0.03)',
        fontWeight: 'bold',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        userSelect: 'none'
      }}>
        CIDADE DOS ANJOS
      </div>
      </div>
    </>
  );
}
