"use client";

import { Scale, Calendar, User, FileText } from "lucide-react";

interface OABTemplateProps {
  numeroOAB?: string;
  nomeAdvogado?: string;
  cpf?: string;
  dataEmissao?: string;
  estadoOAB?: string;
  categoria?: string;
  situacao?: string;
  fotoAdvogado?: string;
}

export default function OABTemplate({
  numeroOAB = "000.000/CDA",
  nomeAdvogado = "Nome do Advogado",
  cpf = "0000",
  dataEmissao = "01/01/2024",
  estadoOAB = "CDA",
  categoria = "Advogado(a)",
  situacao = "REGULAR",
  fotoAdvogado
}: OABTemplateProps) {
  return (
    <div 
      id="oab-template"
      style={{
        width: '800px',
        height: '600px',
        backgroundColor: '#ffffff',
        padding: '48px',
        position: 'relative',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        boxSizing: 'border-box',
        overflow: 'hidden',
        borderRadius: '24px'
      }}
    >
      {/* Cabeçalho com logo e título */}
      <div 
        style={{
          borderBottom: '4px solid #1e3a8a',
          paddingBottom: '32px',
          marginBottom: '40px',
          height: '80px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#1e3a8a',
              borderRadius: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Scale style={{ width: '48px', height: '48px', color: 'white' }} />
            </div>
            <div style={{ lineHeight: 1 }}>
              <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#1e3a8a', margin: 0, marginBottom: '4px' }}>
                OACA/{estadoOAB}
              </h1>
              <p style={{ fontSize: '14px', color: '#4b5563', margin: 0, marginBottom: '2px' }}>
                Ordem dos Advogados da Cidade dos Anjos
              </p>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                Seccional {estadoOAB}
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.8px', margin: 0, marginBottom: '4px' }}>
              Documento Oficial
            </p>
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e3a8a', margin: 0 }}>
              N° {numeroOAB}
            </p>
          </div>
        </div>
      </div>

      {/* Corpo do documento */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', height: '300px' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', height: '220px' }}>
          <div style={{
            width: '165px',
            height: '220px',
            overflow: 'hidden',
            borderRadius: '8px',
            border: '3px solid #1e3a8a',
            flexShrink: 0,
            backgroundColor: fotoAdvogado ? 'transparent' : '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {fotoAdvogado ? (
              <img 
                src={fotoAdvogado} 
                alt="Foto do Advogado" 
                style={{
                  width: '165px',
                  height: '220px',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
              }}>
                <User style={{ width: '56px', height: '56px', color: '#9ca3af' }} />
                <p style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  textAlign: 'center',
                  margin: 0,
                  padding: '0 16px',
                  lineHeight: 1.4
                }}>
                  Foto 3:4<br />não disponível
                </p>
              </div>
            )}
          </div>
          
          <div 
            style={{
              backgroundColor: '#eff6ff',
              padding: '28px',
              borderRadius: '8px',
              borderLeft: '4px solid #1e3a8a',
              flex: 1,
              height: '220px',
              boxSizing: 'border-box'
            }}
          >
            <h2 
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#1e3a8a',
                margin: 0,
                marginBottom: '20px'
              }}
            >
              CARTEIRA DE IDENTIFICAÇÃO PROFISSIONAL
            </h2>
            
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: '210px 210px',
                gap: '24px',
                rowGap: '20px'
              }}
            >
            <div>
              <label 
                style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  display: 'block',
                  marginBottom: '10px'
                }}
              >
                Nome Completo
              </label>
              <p 
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#111827',
                  margin: 0
                }}
              >
                {nomeAdvogado}
              </p>
            </div>
            
            <div>
              <label 
                style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  display: 'block',
                  marginBottom: '6px'
                }}
              >
                Passaporte
              </label>
              <p 
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#111827',
                  margin: 0
                }}
              >
                {cpf}
              </p>
            </div>
            
            <div>
              <label 
                style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  display: 'block',
                  marginBottom: '6px'
                }}
              >
                Categoria
              </label>
              <p 
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#111827',
                  margin: 0
                }}
              >
                {categoria}
              </p>
            </div>
            
            <div>
              <label 
                style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  display: 'block',
                  marginBottom: '6px'
                }}
              >
                Situação
              </label>
              <p 
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#16a34a',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span 
                  style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#22c55e',
                    borderRadius: '50%',
                    display: 'inline-block'
                  }}
                ></span>
                {situacao}
              </p>
            </div>
          </div>
        </div>
        </div>

        {/* Informações adicionais */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: '325px 325px',
            gap: '24px',
            height: '60px'
          }}
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: '16px',
            padding: '12px 16px', 
            backgroundColor: '#f9fafb', 
            borderRadius: '8px',
            height: '60px',
            boxSizing: 'border-box'
          }}>
            <Calendar style={{ width: '20px', height: '20px', color: '#1e3a8a', marginTop: '2px', flexShrink: 0 }} />
            <div>
              <label style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                display: 'block',
                margin: 0,
                marginBottom: '4px'
              }}>
                Data de Emissão
              </label>
              <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                {dataEmissao}
              </p>
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: '12px', 
            padding: '12px 16px', 
            backgroundColor: '#f9fafb', 
            borderRadius: '8px',
            height: '60px',
            boxSizing: 'border-box'
          }}>
            <FileText style={{ width: '20px', height: '20px', color: '#1e3a8a', marginTop: '2px', flexShrink: 0 }} />
            <div>
              <label style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                display: 'block',
                margin: 0,
                marginBottom: '4px'
              }}>
                Inscrição
              </label>
              <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                OACA/{estadoOAB} {numeroOAB}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <div style={{ 
        position: 'absolute', 
        bottom: '32px', 
        left: '48px', 
        right: '48px',
        width: '704px'
      }}>
        <div style={{ 
          borderTop: '2px solid #e5e7eb', 
          paddingTop: '12px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          fontSize: '11px', 
          color: '#6b7280',
          height: '24px'
        }}>
          <p style={{ margin: 0 }}>© {new Date().getFullYear()} OACA - Todos os direitos reservados</p>
          <p style={{ margin: 0 }}>Documento emitido digitalmente - Sistema Judiciário Cidade dos Anjos</p>
        </div>
      </div>

      {/* Marca d'água de segurança */}
      <div style={{ 
        position: 'absolute', 
        top: '108px', 
        left: '208px', 
        width: '384px',
        height: '384px',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        pointerEvents: 'none', 
        opacity: 0.05 
      }}>
        <Scale style={{ width: '384px', height: '384px', color: '#1e3a8a' }} />
      </div>
    </div>
  );
}
