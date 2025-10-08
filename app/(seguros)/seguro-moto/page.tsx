"use client";

import React from 'react';
import { FormularioCotacao } from '@/components/forms/FormularioCotacao';
import { DadosCotacao } from '@/types/cotacao';
import { AlertUtils } from '@/lib/alerts/sweetalert-config';

export default function SeguroMotoPage() {
  const handleSubmit = async (dados: DadosCotacao) => {
    try {
      // Simular envio para API
      console.log('Dados do seguro moto:', dados);
      
      // Mostrar sucesso
      await AlertUtils.confirmSubmission();
      
      // Redirecionar ou fazer outras ações
      // window.location.href = '/cotacao/sucesso';
    } catch (error) {
      console.error('Erro ao enviar cotação:', error);
      await AlertUtils.error({
        title: 'Erro',
        text: 'Ocorreu um erro ao enviar sua cotação. Tente novamente.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-accent text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Seguro de Moto
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Proteja sua motocicleta com segurança e tranquilidade
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Cobertura Especializada</h3>
              <p className="text-sm opacity-90">
                Proteção específica para motocicletas contra roubo e danos
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Assistência Moto</h3>
              <p className="text-sm opacity-90">
                Suporte especializado para motociclistas, 24 horas por dia
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Preço Acessível</h3>
              <p className="text-sm opacity-90">
                Seguro de moto com preços justos e cobertura completa
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário de Cotação */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Solicite sua Cotação
            </h2>
            <p className="text-gray-600">
              Preencha os dados abaixo e receba uma cotação personalizada para sua moto
            </p>
          </div>
          
          <FormularioCotacao 
            tipoSeguro="moto" 
            onSubmit={handleSubmit}
          />
        </div>
      </div>

      {/* Benefícios */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Por que escolher nosso Seguro de Moto?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Cobertura Completa</h3>
              <p className="text-gray-600 text-sm">
                Proteção contra roubo, furto, incêndio e danos acidentais
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Assistência 24h</h3>
              <p className="text-gray-600 text-sm">
                Suporte especializado para motociclistas a qualquer hora
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Preço Justo</h3>
              <p className="text-gray-600 text-sm">
                Seguro de moto com preços acessíveis e cobertura completa
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Processo Rápido</h3>
              <p className="text-gray-600 text-sm">
                Cotação em minutos e aprovação em até 24 horas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="bg-brand-primary text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para proteger sua moto?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Solicite sua cotação agora e garanta a melhor proteção para sua motocicleta
          </p>
          <button 
            onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-brand-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Solicitar Cotação
          </button>
        </div>
      </div>
    </div>
  );
}
