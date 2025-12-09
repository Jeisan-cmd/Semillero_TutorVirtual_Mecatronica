// Parseador del texto generado por la AI. Extrae secciones según formato esperado.
export function procesarContenidoTema(responseText: string) {
  // Título
  const titleMatch = responseText.match(/^#\s*(.*?)$/m) || responseText.match(/^(.*?)$/m)
  const title = titleMatch ? titleMatch[1].trim() : ''

  // Definición
  const definitionRegex = /## Definición\n([\s\S]*?)(?=\n##)/i
  const definitionMatch = responseText.match(definitionRegex)
  const definition = definitionMatch ? definitionMatch[1].trim() : ''

  // Conceptos clave
  const conceptsRegex = /## Conceptos Clave\n([\s\S]*?)(?=\n##)/i
  const conceptsMatch = responseText.match(conceptsRegex)
  const conceptsText = conceptsMatch ? conceptsMatch[1] : ''
  const conceptLines = conceptsText.split('\n').filter(line => line.trim().startsWith('-'))
  const concepts = conceptLines.map(line => {
    const cleanLine = line.replace(/^-\s*/, '').trim()
    const titleMatch = cleanLine.match(/\*\*(.*?)\*\*:(.*)/) || cleanLine.match(/(.*?):(.*)/)
    if (titleMatch) return { title: titleMatch[1].trim(), description: titleMatch[2].trim() }
    return { title: 'Concepto', description: cleanLine }
  })

  // Explicación detallada
  const explanationRegex = /## Explicación Detallada\n([\s\S]*?)(?=\n##)/i
  const explanationMatch = responseText.match(explanationRegex)
  const explanation = explanationMatch ? explanationMatch[1].trim() : ''

  // Ejemplo resuelto (problema/solución/conclusión)
  const exampleRegex = /## Ejemplo Resuelto\n([\s\S]*?)(?=\n##|$)/i
  const exampleMatch = responseText.match(exampleRegex)
  const exampleText = exampleMatch ? exampleMatch[1] : ''
  const problemRegex = /Problema:\s*([\s\S]*?)(?=\n\nSolución:)/i
  const problemMatch = exampleText.match(problemRegex)
  const problem = problemMatch ? problemMatch[1].trim() : ''
  const solutionRegex = /Solución:\s*([\s\S]*?)(?=\n\nConclusión:|$)/i
  const solutionMatch = exampleText.match(solutionRegex)
  const solution = solutionMatch ? solutionMatch[1].trim() : ''
  const conclusionRegex = /Conclusión:\s*([\s\S]*?)$/i
  const conclusionMatch = exampleText.match(conclusionRegex)
  const conclusion = conclusionMatch ? conclusionMatch[1].trim() : ''

  // Aplicaciones prácticas
  const applicationsRegex = /## Aplicaciones Prácticas\n([\s\S]*?)(?=\n##|$)/i
  const applicationsMatch = responseText.match(applicationsRegex)
  const applicationsText = applicationsMatch ? applicationsMatch[1] : ''
  const applicationLines = applicationsText.split('\n').filter(line => /^\d+\./.test(line.trim()))
  const applications = applicationLines.map(line => line.replace(/^\d+\.\s*/, '').trim())

  return { title, definition, concepts, explanation, example: { problem, solution, conclusion }, applications }
}