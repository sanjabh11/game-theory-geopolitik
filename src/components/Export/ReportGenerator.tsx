import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DocumentArrowDownIcon, 
  DocumentTextIcon, 
  TableCellsIcon, 
  ChartBarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface ReportGeneratorProps {
  type: 'risk' | 'crisis' | 'simulation' | 'prediction';
  data: any;
  title: string;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ type, data, title }) => {
  const [format, setFormat] = useState<'pdf' | 'csv' | 'json'>('pdf');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeRawData, setIncludeRawData] = useState(false);
  const [includeMethodology, setIncludeMethodology] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  const handleGenerateReport = async () => {
    try {
      setGenerating(true);
      setReportGenerated(false);
      
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would call a backend service to generate the report
      // For now, we'll just simulate success
      
      setReportGenerated(true);
      toast.success(`${format.toUpperCase()} report generated successfully`);
    } catch (error) {
      toast.error('Failed to generate report');
      console.error('Error generating report:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    // In a real implementation, this would download the actual file
    // For now, we'll just simulate a download by creating a dummy file
    
    let content = '';
    let filename = '';
    let mimeType = '';
    
    if (format === 'json') {
      content = JSON.stringify(data, null, 2);
      filename = `${type}_report_${Date.now()}.json`;
      mimeType = 'application/json';
    } else if (format === 'csv') {
      // Simple CSV generation for demo purposes
      const headers = Object.keys(data).join(',');
      const values = Object.values(data).join(',');
      content = `${headers}\n${values}`;
      filename = `${type}_report_${Date.now()}.csv`;
      mimeType = 'text/csv';
    } else {
      // For PDF, we'd normally use a library like jsPDF
      // For this demo, we'll just create a text file
      content = `Report Title: ${title}\n\nData: ${JSON.stringify(data, null, 2)}`;
      filename = `${type}_report_${Date.now()}.txt`;
      mimeType = 'text/plain';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Downloaded ${filename}`);
  };

  const getFormatIcon = (formatType: string) => {
    switch (formatType) {
      case 'pdf':
        return DocumentTextIcon;
      case 'csv':
        return TableCellsIcon;
      case 'json':
        return DocumentArrowDownIcon;
      default:
        return DocumentTextIcon;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <DocumentArrowDownIcon className="h-6 w-6 mr-2 text-blue-600" />
        Export Report
      </h2>
      
      <div className="space-y-6">
        {/* Format Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Report Format
          </label>
          <div className="grid grid-cols-3 gap-4">
            {['pdf', 'csv', 'json'].map((formatType) => {
              const Icon = getFormatIcon(formatType);
              const isSelected = format === formatType;
              
              return (
                <button
                  key={formatType}
                  onClick={() => setFormat(formatType as any)}
                  className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <Icon className={`h-8 w-8 mb-2 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className="text-sm font-medium uppercase">{formatType}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Report Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Report Options
          </label>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                id="include-charts"
                type="checkbox"
                checked={includeCharts}
                onChange={(e) => setIncludeCharts(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="include-charts" className="ml-2 block text-sm text-gray-700">
                Include charts and visualizations
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="include-raw-data"
                type="checkbox"
                checked={includeRawData}
                onChange={(e) => setIncludeRawData(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="include-raw-data" className="ml-2 block text-sm text-gray-700">
                Include raw data tables
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="include-methodology"
                type="checkbox"
                checked={includeMethodology}
                onChange={(e) => setIncludeMethodology(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="include-methodology" className="ml-2 block text-sm text-gray-700">
                Include methodology explanation
              </label>
            </div>
          </div>
        </div>
        
        {/* Report Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Report Preview
          </label>
          <div className="border rounded-lg p-4 bg-gray-50 h-48 overflow-auto">
            <div className="text-center text-gray-500 flex flex-col items-center justify-center h-full">
              {reportGenerated ? (
                <>
                  <CheckCircleIcon className="h-12 w-12 text-green-500 mb-2" />
                  <p className="font-medium text-green-600">Report Generated Successfully</p>
                  <p className="text-sm text-gray-500 mt-1">Click the download button below to save your report</p>
                </>
              ) : (
                <>
                  <DocumentTextIcon className="h-12 w-12 text-gray-400 mb-2" />
                  <p>Report preview will appear here</p>
                  <p className="text-sm mt-1">Configure options and generate report</p>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleGenerateReport}
            disabled={generating}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <ChartBarIcon className="h-5 w-5" />
                <span>Generate Report</span>
              </>
            )}
          </button>
          
          {reportGenerated && (
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <DocumentArrowDownIcon className="h-5 w-5" />
              <span>Download Report</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ReportGenerator;