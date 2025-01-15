import React, { useState } from 'react';
import { CheckCircle, Clock, Download, Users, Target, ChevronDown, ChevronUp } from 'lucide-react';
import type { Summary } from '../types';
import { jsPDF } from 'jspdf';

interface SummaryProps {
  data: Summary;
}

interface SectionProps {
  title: string;
  content: string;
}

function Section({ title, content }: SectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border-b border-gray-700 last:border-b-0 py-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left mb-2"
      >
        <h3 className="text-lg font-medium text-white">{title}</h3>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {isExpanded && (
        <div className="prose prose-invert max-w-none">
          <div className="text-gray-300 leading-relaxed space-y-4">
            {content.split('\n').map((paragraph, index) => (
              paragraph.trim() && (
                <p key={index} className="my-2">
                  {paragraph.trim()}
                </p>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function SummaryView({ data }: SummaryProps) {
  const sections = data.text.split(/(?=\d\.\s(?:Meeting Overview|Detailed Discussion|Decision Analysis|Action Items|Next Steps))/);

  const handleDownload = () => {
    const pdf = new jsPDF();
    const lineHeight = 7;
    let yPosition = 20;
    const margin = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const maxWidth = pageWidth - 2 * margin;

    // Add title and metadata
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Meeting Summary', margin, yPosition);
    yPosition += lineHeight * 2;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Generated: ${new Date(data.date).toLocaleString()}`, margin, yPosition);
    yPosition += lineHeight * 2;

    // Add sections
    pdf.setFontSize(12);
    sections.forEach(section => {
      if (!section.trim()) return;

      // Extract section title
      const titleMatch = section.match(/^\d\.\s[^\n]+/);
      if (titleMatch) {
        // Add section title
        pdf.setFont('helvetica', 'bold');
        pdf.text(titleMatch[0], margin, yPosition);
        yPosition += lineHeight * 1.5;

        // Add section content
        pdf.setFont('helvetica', 'normal');
        const content = section.substring(titleMatch[0].length).trim();
        const lines = pdf.splitTextToSize(content, maxWidth);

        // Check if we need a new page
        if (yPosition + lines.length * lineHeight > pdf.internal.pageSize.getHeight() - margin) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.text(lines, margin, yPosition);
        yPosition += lines.length * lineHeight + lineHeight;
      }
    });

    // Add action items
    if (data.actionItems.length > 0) {
      if (yPosition + (data.actionItems.length + 2) * lineHeight > pdf.internal.pageSize.getHeight() - margin) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFont('helvetica', 'bold');
      pdf.text('Detailed Action Items:', margin, yPosition);
      yPosition += lineHeight * 1.5;
      
      pdf.setFont('helvetica', 'normal');
      data.actionItems.forEach(item => {
        const lines = pdf.splitTextToSize(`• ${item}`, maxWidth);
        pdf.text(lines, margin, yPosition);
        yPosition += lines.length * lineHeight;
      });
    }

    pdf.save(`detailed-meeting-summary-${new Date(data.date).toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-6 bg-gray-800/50 rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-white">Detailed Meeting Summary</h2>
        <button 
          onClick={handleDownload}
          className="flex items-center justify-center space-x-2 text-white bg-purple-600 hover:bg-purple-700 transition-colors px-6 py-3 rounded-lg font-medium w-full sm:w-auto"
        >
          <Download className="w-5 h-5" />
          <span>Download Summary as PDF</span>
        </button>
      </div>

      <div className="space-y-2">
        {sections.map((section, index) => {
          if (!section.trim()) return null;
          const titleMatch = section.match(/^\d\.\s[^\n]+/);
          if (!titleMatch) return null;

          return (
            <Section
              key={index}
              title={titleMatch[0]}
              content={section.substring(titleMatch[0].length).trim()}
            />
          );
        })}

        <div className="border-t border-gray-700 pt-4 mt-6">
          <div className="flex items-center space-x-2 mb-3">
            <Target className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-medium text-white">Action Items</h3>
          </div>
          <ul className="space-y-3">
            {data.actionItems.map((item, index) => (
              <li key={index} className="flex items-start space-x-3 bg-gray-800/30 p-3 rounded-lg">
                <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-400 border-t border-gray-700 pt-4 mt-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <time>{new Date(data.date).toLocaleString()}</time>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              <span>Meeting Participants</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}