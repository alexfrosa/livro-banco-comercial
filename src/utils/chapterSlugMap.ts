/**
 * chapterSlugMap.ts
 *
 * Canonical mapping from old Section_Slugs (caps 00–77) to new Section_Slugs (caps 01–29).
 * Used by progressMigration.ts and tests.
 *
 * Format:
 *   Key:   "<old-chapter-folder-slug>/<section-filename-without-ext>"
 *   Value: "<new-chapter-folder-slug>/<new-section-filename-without-ext>"
 *
 * Req 7.1, 7.2, 7.3, 7.4, 7.5
 */

export const MIGRATION_VERSION = "2";

// Record<oldSlug, newSlug>
export const CHAPTER_SLUG_MAP: Record<string, string> = {

  // ── Parte I — Fundamentos do Banco Comercial ─────────────────────────────
  // Cap 01 (01-fundamentos-bancarios) ← 00 + 01
  "00-introducao/01-objetivo":                              "01-fundamentos-bancarios/01-objetivo",
  "00-introducao/02-o-que-e-backoffice":                    "01-fundamentos-bancarios/02-o-que-e-backoffice",
  "01-o-que-e-um-banco/01-conceitos":                       "01-fundamentos-bancarios/03-conceitos",
  "01-o-que-e-um-banco/02-operacao-real":                   "01-fundamentos-bancarios/04-operacao-real",

  // Cap 02 (02-regulacao-e-arquitetura) ← 02 + 03
  "02-regulacao/01-conceitos":                              "02-regulacao-e-arquitetura/01-conceitos",
  "02-regulacao/02-operacao-real":                          "02-regulacao-e-arquitetura/02-operacao-real",
  "03-arquitetura/01-conceitos":                            "02-regulacao-e-arquitetura/03-conceitos-arquitetura",
  "03-arquitetura/02-operacao-real":                        "02-regulacao-e-arquitetura/04-operacao-real-arquitetura",

  // Cap 03 (03-kyc-onboarding-ledger) ← 04 + 05 + 06 + 10 + 11 + 12
  "04-kyc-conceitos/01-conceitos":                          "03-kyc-onboarding-ledger/01-conceitos",
  "05-onboarding/01-jornada":                               "03-kyc-onboarding-ledger/02-jornada",
  "05-onboarding/02-backoffice":                            "03-kyc-onboarding-ledger/03-backoffice",
  "06-simulacao-kyc/01-simulacao":                          "03-kyc-onboarding-ledger/04-simulacao-kyc",
  "10-ledger-conceitos/01-conceitos":                       "03-kyc-onboarding-ledger/05-conceitos-ledger",
  "11-jornada-ledger/01-jornada":                           "03-kyc-onboarding-ledger/06-jornada-ledger",
  "11-jornada-ledger/02-backoffice":                        "03-kyc-onboarding-ledger/07-backoffice-ledger",
  "12-simulacao-ledger/01-simulacao":                       "03-kyc-onboarding-ledger/08-simulacao-ledger",

  // ── Parte II — Conta Corrente, Poupança e Tarifas ────────────────────────
  // Cap 04 (04-contas-bancarias) ← 07 + 08 + 09
  "07-contas-conceitos/01-conceitos":                       "04-contas-bancarias/01-conceitos",
  "08-jornada-contas/01-jornada":                           "04-contas-bancarias/02-jornada",
  "08-jornada-contas/02-backoffice":                        "04-contas-bancarias/03-backoffice",
  "09-simulacao-contas/01-simulacao":                       "04-contas-bancarias/04-simulacao",

  // Cap 05 (05-tarifas-bancarias) ← 20 + 21 + 22
  "20-tarifas-conceitos/01-conceitos":                      "05-tarifas-bancarias/01-conceitos",
  "21-jornada-tarifas/01-jornada":                          "05-tarifas-bancarias/02-jornada",
  "21-jornada-tarifas/02-backoffice":                       "05-tarifas-bancarias/03-backoffice",
  "22-simulacao-tarifas/01-simulacao":                      "05-tarifas-bancarias/04-simulacao",

  // ── Parte III — Pagamentos ────────────────────────────────────────────────
  // Cap 06 (06-pagamentos) ← 13 + 14 + 15
  "13-pagamentos-conceitos/01-conceitos":                   "06-pagamentos/01-conceitos",
  "14-jornada-pagamentos/01-jornada":                       "06-pagamentos/02-jornada",
  "14-jornada-pagamentos/02-backoffice":                    "06-pagamentos/03-backoffice",
  "15-simulacao-pagamentos/01-simulacao":                   "06-pagamentos/04-simulacao",

  // Cap 07 (07-operacoes-fim-de-dia) ← 75
  "75-cnab-operacoes-fim-dia/01-cnab":                      "07-operacoes-fim-de-dia/01-cnab",
  "75-cnab-operacoes-fim-dia/02-liquidacao-fechamento":     "07-operacoes-fim-de-dia/02-liquidacao-fechamento",

  // ── Parte IV — Cartões de Crédito ─────────────────────────────────────────
  // Cap 08 (08-cartao-de-credito) ← 50 + 51
  // actual files: 01-conceitos, 02-jornada
  "50-cartao-credito-conceitos/01-conceitos":               "08-cartao-de-credito/01-conceitos",
  "51-jornada-cartao-credito/01-jornada":                   "08-cartao-de-credito/02-jornada",

  // ── Parte V — Empréstimos e Financiamento ────────────────────────────────
  // Cap 09 (09-credito) ← 16 + 17 + 18 + 19
  "16-credito-conceitos/01-conceitos":                      "09-credito/01-conceitos",
  "17-originacao-credito/01-jornada":                       "09-credito/02-jornada-originacao",
  "17-originacao-credito/02-backoffice":                    "09-credito/03-backoffice-originacao",
  "18-gestao-credito/01-jornada":                           "09-credito/04-jornada-gestao",
  "18-gestao-credito/02-backoffice":                        "09-credito/05-backoffice-gestao",
  "19-simulacao-credito/01-simulacao":                      "09-credito/06-simulacao",

  // Cap 10 (10-modalidades-credito) ← 47 + 48 + 49
  // actual files: 01-conceitos, 02-jornada, 03-simulacao
  "47-modalidades-credito-conceitos/01-conceitos":          "10-modalidades-credito/01-conceitos",
  "48-jornada-modalidades-credito/01-jornada":              "10-modalidades-credito/02-jornada",
  "49-simulacao-modalidades-credito/01-simulacao":          "10-modalidades-credito/03-simulacao",

  // Cap 11 (11-credito-avancado) ← 69
  "69-ecl-cobranca-recuperacao/01-ecl":                     "11-credito-avancado/01-ecl",
  "69-ecl-cobranca-recuperacao/02-cobranca":                "11-credito-avancado/02-cobranca",

  // ── Parte VI — Seguros, Capitalização e Consórcio ────────────────────────
  // Cap 12 (12-seguros-bancassurance) ← 61 + 62
  // actual files: 01-conceitos, 02-jornada
  "61-seguros-conceitos/01-conceitos":                      "12-seguros-bancassurance/01-conceitos",
  "62-jornada-seguros/01-jornada":                          "12-seguros-bancassurance/02-jornada",

  // Cap 13 (13-titulos-capitalizacao) ← novo (sem entradas de origem)

  // Cap 14 (14-consorcio) ← 63 + 64
  "63-consorcio-conceitos/01-conceitos":                    "14-consorcio/01-conceitos",
  "64-jornada-consorcio/01-jornada":                        "14-consorcio/02-jornada",

  // ── Parte VII — Investimentos ─────────────────────────────────────────────
  // Cap 15 (15-investimentos-renda-variavel) ← 37 + 38 + 39 + 56 + 57 + 58
  // actual files: 01-conceitos-renda-fixa, 02-jornada-investimentos,
  //               03-simulacao-investimentos, 04-conceitos-renda-variavel,
  //               05-jornada-home-broker, 06-simulacao-carteira
  "37-investimentos-conceitos/01-conceitos":                "15-investimentos-renda-variavel/01-conceitos-renda-fixa",
  "38-jornada-investimentos/01-jornada":                    "15-investimentos-renda-variavel/02-jornada-investimentos",
  "39-simulacao-investimentos/01-simulacao":                "15-investimentos-renda-variavel/03-simulacao-investimentos",
  "56-renda-variavel-conceitos/01-conceitos":               "15-investimentos-renda-variavel/04-conceitos-renda-variavel",
  "57-jornada-renda-variavel/01-jornada":                   "15-investimentos-renda-variavel/05-jornada-home-broker",
  "58-simulacao-renda-variavel/01-simulacao":               "15-investimentos-renda-variavel/06-simulacao-carteira",

  // Cap 16 (16-fundos-previdencia) ← 52 + 53 + 54 + 55
  // actual files: 01-conceitos-fundos, 02-cota-tributacao, 03-jornada-fundos,
  //               04-backoffice-fundos, 05-conceitos-previdencia, 06-fase-beneficio,
  //               07-jornada-previdencia, 08-backoffice-previdencia
  "52-fundos-investimento-conceitos/01-conceitos":          "16-fundos-previdencia/01-conceitos-fundos",
  "52-fundos-investimento-conceitos/02-cota-e-tributacao":  "16-fundos-previdencia/02-cota-tributacao",
  "53-jornada-fundos/01-jornada":                           "16-fundos-previdencia/03-jornada-fundos",
  "53-jornada-fundos/02-backoffice":                        "16-fundos-previdencia/04-backoffice-fundos",
  "54-previdencia-privada-conceitos/01-conceitos":          "16-fundos-previdencia/05-conceitos-previdencia",
  "54-previdencia-privada-conceitos/02-fase-beneficio":     "16-fundos-previdencia/06-fase-beneficio",
  "55-jornada-previdencia/01-jornada":                      "16-fundos-previdencia/07-jornada-previdencia",
  "55-jornada-previdencia/02-backoffice":                   "16-fundos-previdencia/08-backoffice-previdencia",

  // Cap 17 (17-suitability-fidc-custodia) ← 73
  "73-suitability-fidc-custodia/01-suitability":            "17-suitability-fidc-custodia/01-suitability",
  "73-suitability-fidc-custodia/02-fidc":                   "17-suitability-fidc-custodia/02-fidc",
  "73-suitability-fidc-custodia/03-custodia-centralizada":  "17-suitability-fidc-custodia/03-custodia-centralizada",

  // ── Parte VIII — Tesouraria, ALM e Funding ───────────────────────────────
  // Cap 18 (18-tesouraria-liquidez) ← 23 + 24 + 25
  "23-tesouraria-conceitos/01-conceitos":                   "18-tesouraria-liquidez/01-conceitos",
  "24-jornada-tesouraria/01-jornada":                       "18-tesouraria-liquidez/02-jornada",
  "24-jornada-tesouraria/02-backoffice":                    "18-tesouraria-liquidez/03-backoffice",
  "25-simulacao-liquidez/01-simulacao":                     "18-tesouraria-liquidez/04-simulacao",

  // Cap 19 (19-alm-funding) ← 26 + 27 + 28 + 29
  // actual files: 01-conceitos-alm, 02-jornada-alm, 03-backoffice-alm, 04-funding, 05-simulacao-alm
  "26-alm-conceitos/01-conceitos":                          "19-alm-funding/01-conceitos-alm",
  "27-jornada-alm/01-jornada":                              "19-alm-funding/02-jornada-alm",
  "27-jornada-alm/02-backoffice":                           "19-alm-funding/03-backoffice-alm",
  "28-funding/01-conceitos":                                "19-alm-funding/04-funding",
  "29-simulacao-alm/01-simulacao":                          "19-alm-funding/05-simulacao-alm",

  // ── Parte IX — Câmbio ─────────────────────────────────────────────────────
  // Cap 20 (20-cambio) ← 59 + 60 + 72
  // actual files: 01-conceitos, 02-swift-correspondentes, 03-jornada,
  //               04-backoffice, 05-acc-ace, 06-carta-credito
  "59-cambio-conceitos/01-conceitos":                       "20-cambio/01-conceitos",
  "59-cambio-conceitos/02-swift-correspondentes":           "20-cambio/02-swift-correspondentes",
  "60-jornada-cambio/01-jornada":                           "20-cambio/03-jornada",
  "60-jornada-cambio/02-backoffice":                        "20-cambio/04-backoffice",
  "72-cambio-comercial-avancado/01-acc-ace":                "20-cambio/05-acc-ace",
  "72-cambio-comercial-avancado/02-carta-credito-posicao":  "20-cambio/06-carta-credito",

  // ── Parte X — Compliance e Contabilidade ─────────────────────────────────
  // Cap 21 (21-gestao-risco) ← 30 + 74
  "30-risco-conceitos/01-conceitos":                        "21-gestao-risco/01-conceitos",
  "74-rcsa-icaap/01-rcsa":                                  "21-gestao-risco/02-rcsa",
  "74-rcsa-icaap/02-icaap":                                 "21-gestao-risco/03-icaap",

  // Cap 22 (22-aml-pld-sancoes) ← 31 + 32 + 33 + 76
  // actual files: 01-conceitos-pld, 02-jornada-pld, 03-reportes-regulatorios,
  //               04-simulacao-aml, 05-pep, 06-coaf-operacional, 07-sancoes-lgpd
  "31-aml-pld/01-conceitos":                                "22-aml-pld-sancoes/01-conceitos-pld",
  "31-aml-pld/02-jornada":                                  "22-aml-pld-sancoes/02-jornada-pld",
  "32-regulatorios/01-conceitos":                           "22-aml-pld-sancoes/03-reportes-regulatorios",
  "33-simulacao-compliance/01-simulacao":                   "22-aml-pld-sancoes/04-simulacao-aml",
  "76-pep-coaf-sancoes/01-pep":                             "22-aml-pld-sancoes/05-pep",
  "76-pep-coaf-sancoes/02-coaf-operacional":                "22-aml-pld-sancoes/06-coaf-operacional",
  "76-pep-coaf-sancoes/03-sancoes-lgpd":                    "22-aml-pld-sancoes/07-sancoes-lgpd",

  // Cap 23 (23-contabilidade-bancaria) ← 34 + 35 + 36 + 71
  // actual files: 01-conceitos-cosif, 02-jornada-contabil, 03-backoffice-fechamento,
  //               04-simulacao-contabilidade, 05-dre-bancaria, 06-fechamento-mensal
  "34-cosif/01-conceitos":                                  "23-contabilidade-bancaria/01-conceitos-cosif",
  "35-jornada-contabil/01-jornada":                         "23-contabilidade-bancaria/02-jornada-contabil",
  "35-jornada-contabil/02-backoffice":                      "23-contabilidade-bancaria/03-backoffice-fechamento",
  "36-simulacao-contabilidade/01-simulacao":                "23-contabilidade-bancaria/04-simulacao-contabilidade",
  "71-dre-fechamento-contabil/01-dre-bancaria":             "23-contabilidade-bancaria/05-dre-bancaria",
  "71-dre-fechamento-contabil/02-fechamento":               "23-contabilidade-bancaria/06-fechamento-mensal",

  // Cap 24 (24-scr-registradoras-compulsorio) ← 68 + 70
  "68-scr-registradoras/01-scr":                            "24-scr-registradoras-compulsorio/01-scr",
  "68-scr-registradoras/02-registradoras":                  "24-scr-registradoras-compulsorio/02-registradoras",
  "70-compulsorio-titulos-publicos/01-compulsorio":         "24-scr-registradoras-compulsorio/03-compulsorio",
  "70-compulsorio-titulos-publicos/02-titulos-publicos":    "24-scr-registradoras-compulsorio/04-titulos-publicos",

  // ── Parte XI — Ecossistema Digital e Regulação ───────────────────────────
  // Cap 25 (25-open-finance) ← 65 + 66
  "65-open-finance-conceitos/01-conceitos":                 "25-open-finance/01-conceitos",
  "65-open-finance-conceitos/02-pisp-agregacao":            "25-open-finance/02-pisp-agregacao",
  "66-jornada-open-finance/01-jornada":                     "25-open-finance/03-jornada",
  "66-jornada-open-finance/02-backoffice":                  "25-open-finance/04-backoffice",

  // Cap 26 (26-baas-fintechs) ← 67
  "67-baas-fintechs/01-conceitos":                          "26-baas-fintechs/01-conceitos",
  "67-baas-fintechs/02-licencas-e-riscos":                  "26-baas-fintechs/02-licencas-e-riscos",

  // ── Parte XII — Cenários Críticos e Simulador ────────────────────────────
  // Cap 27 (27-falhas-fraudes-reconciliacao) ← 40 + 41 + 42 + 43 + 44
  "40-falhas-operacionais/01-conceitos":                    "27-falhas-fraudes-reconciliacao/01-falhas-operacionais",
  "41-fraudes/01-conceitos":                                "27-falhas-fraudes-reconciliacao/02-fraudes",
  "42-inconsistencias/01-conceitos":                        "27-falhas-fraudes-reconciliacao/03-inconsistencias",
  "43-reconciliacao/01-conceitos":                          "27-falhas-fraudes-reconciliacao/04-reconciliacao",
  "44-simulacao-cenarios-criticos/01-simulacao":            "27-falhas-fraudes-reconciliacao/05-simulacao-cenarios-criticos",

  // Cap 28 (28-expansao-casos-praticos) ← 45 + 46 + 77
  "45-intro-simulador/01-conceitos":                        "28-expansao-casos-praticos/01-intro-simulador",
  "46-expansao/01-conceitos":                               "28-expansao-casos-praticos/02-expansao",
  "77-casos-praticos/01-caso-credito":                      "28-expansao-casos-praticos/03-caso-credito",
  "77-casos-praticos/02-caso-pld":                          "28-expansao-casos-praticos/04-caso-pld",
  "77-casos-praticos/03-caso-incidente":                    "28-expansao-casos-praticos/05-caso-incidente",

  // Cap 29 (29-simulador-integrado) ← standalone (sem entradas de origem)
};
