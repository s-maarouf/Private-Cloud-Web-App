// Format de date pour l'affichage
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Formatter des nombres avec séparateur de milliers
export const formatNumber = (number) => {
  return new Intl.NumberFormat('fr-FR').format(number);
};

// Tronquer un texte avec ellipsis si trop long
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};
